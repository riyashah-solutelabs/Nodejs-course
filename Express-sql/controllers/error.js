exports.get404 = (req,res,next) => {
    // res.status(404).send('<h1>404 Error!!Page Not Found....</h1>')
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'))
    res.status(404).render('404',{pageTitle : 'Error Page', path : '/404'})
}