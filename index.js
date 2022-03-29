const pup = require('puppeteer');

const url = 'https://www.mercadolivre.com.br/';
const searchFor = 'macbook';


let c = 1;
const list = [];


(async () => {
    const browser = await pup.launch({headless: false}) //headless = esconder o processo.
    const page = await browser.newPage()
    console.log('Iniciei')

    await page.goto(url)
    console.log('Fui para a URL')

    await page.waitForSelector('#cb1-edit')
    console.log('Esperando carregar elemento')

    await page.type('#cb1-edit', searchFor)
    console.log('Pesquisando elemento')

    await Promise.all([
        page.waitForNavigation(),
        
        page.click('.nav-search-btn'),
        console.log('Clicando no pesquisar')
    ]);

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href)) // $$ = document.selectorAll
    console.log('Pegando links')

    for(const link of links){
        if(c === 10) continue;
        console.log('Página', c)
        await page.goto(link)
        await page.waitForSelector('.ui-pdp-title');

        const title = await page.$eval('.ui-pdp-title', element => element.innerText)
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText)

        const seller = await page.evaluate(()=>{
            const el = document.querySelector('.ui-pdp-seller__link-trigger')
            if(!el) return null
            return el.innerText;
        })

        const objeto = {};
        objeto.title = title;
        objeto.price = price;

        (seller ? objeto.seller = seller : '');
        
        objeto.link = link;
        list.push(objeto);

        c++
    }

    console.log(list);

    await page.waitForTimeout(3000)

    await browser.close();
    console.log('Fechei')

})();