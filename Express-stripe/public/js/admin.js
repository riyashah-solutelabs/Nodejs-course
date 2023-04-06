// without need to reload page delete products
const deleteProduct = (btn) => {
    console.log(btn.parentNode);
    console.log(btn.parentNode.querySelector('[name=productId]'))

    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article')

    fetch('/admin/product/'+ prodId,{
        method : 'DELETE',
        headers : {
            'csrf-token':csrf
        }
    })
    .then(result => {
        return result.json()
    })
    .then(data => {
        productElement.parentNode.removeChild(productElement)
    })
    .catch(err => {
        console.log(err);
    })
}

// exports.deleteProduct = deleteProduct;