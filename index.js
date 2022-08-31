const express = require('express');
const axios = require ('axios');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 3000;
const articles = [];


const hajereducationCategories=[
  {
    category:'chimie',
    address:'https://hajereducation.tn/category/chimie/'
  },
  {
    category:'physique',
    address:'https://hajereducation.tn/category/physique/'
  },
  {
     category:'math',
     address:'https://hajereducation.tn/category/mathematiques/'
  },
  {
     category:'coding',
      address:'https://hajereducation.tn/category/coding/'
  }
];


  hajereducationCategories.forEach(hajereducationCategory=>{

      axios.get(hajereducationCategory.address)
        .then((response)=>{

          const html=response.data;
          //console.log(html);
          const $=cheerio.load(html);

          $('.post-card__container' , html).each(function(){
            const title =$('h2',this).text();
            const url = $('a',this).attr('href');
            
    
            articles.push({
               
              category :hajereducationCategory.category,
              title,
              url
              
             })
            
            
           })
        
          }).catch(err => console.error(err));
   })

 


  app.get('/hajereducation',(req,res)=>{

  res.json(articles);
    
      
  
  })

  app.get('/hajereducation/:hajereducationCategoryId', async(req,res)=>{
    const hajereducationCategoryId=req.params.hajereducationCategoryId;
    const hajereducationCategory = hajereducationCategories.filter(hajereducationCategory=>hajereducationCategory.category == hajereducationCategoryId);
    const hajereducationCatAddress = hajereducationCategories.filter(hajereducationCategory=>hajereducationCategory.category == hajereducationCategoryId)[0].address;
   
       axios.get(hajereducationCatAddress)
       .then(response=>{
        const html =response.data;
        const $= cheerio.load(html);
        const categoryArticles =[];
        $('.post-card__container' , html).each(function(){
          const title =$('h2',this).text();
          const url = $('a',this).attr('href');
         
  
          categoryArticles.push({
           
            Category:hajereducationCategoryId,
            title,
            url
            
           })
          
          
         })
         res.json(categoryArticles);
        }).catch(err => console.error(err));

       })
    



    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    })