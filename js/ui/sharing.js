// Social Sharing Module
function getShareUrl(id) {
    const loc = window.location;
    let path = loc.pathname;
    if (path.endsWith('.html')) {
        path = path.substring(0, path.lastIndexOf('/'));
    }
    if (!path.endsWith('/pages')) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        path = path + '/pages';
    }
    return `${loc.protocol}//${loc.host}${path}/explorar.html?bodega=${id}`;
}

export function initSharing() {
    document.addEventListener('click', (e) => {
        const shareBtn = e.target.closest('.share-btn');
        if (shareBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = shareBtn.getAttribute('data-id');
            const name = shareBtn.getAttribute('data-name');
            const url = getShareUrl(id);
            
            let shareLink = '';
            if (shareBtn.classList.contains('share-whatsapp')) {
                shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent('Mira esta increíble bodega en Entre Copas: ' + name + ' ' + url)}`;
            } else if (shareBtn.classList.contains('share-facebook')) {
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if (shareBtn.classList.contains('share-x')) {
                shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Descubre ' + name + ' en Entre Copas:')}&url=${encodeURIComponent(url)}`;
            }
            
            if (shareLink) {
                window.open(shareLink, '_blank', 'width=600,height=400');
            }
        }
    });
}
