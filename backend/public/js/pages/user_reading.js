$(document).ready(async function () {
    "use strict";
    let books = [];
    let pageBook = {};

    const path = window.location.pathname.split('/');
    const bookIndex = path.indexOf('books')
    const bookId = bookIndex > -1 ? path[bookIndex + 1] : '';
    const bookSlug = bookIndex > -1 ? path[bookIndex + 2] : '';
    // console.log(bookId,bookSlug);

    try {
        pageBook = await request(`/api/v1/books/${bookId}`, 'GET');
        
        // const url = `https://jpalorwu.com${pageBook.bookfileUrl}`;
        const url = `http://localhost:3000${pageBook.bookfileUrl}`;
        console.log(url);

        await pdfjsLib.getDocument(url).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                document.getElementById('pdfViewer').appendChild(canvas);

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        });
    } catch (error) {
        console.log(error);
        showAlert('Could retrieve the book. Reload the page to try again');
    }

    /*
    <script src="path-to/pdf.js"></script>
<script src="path-to/pdf.worker.js"></script>

<div id="pdfViewer" style="width: 100%; height: 80vh;"></div>

<script>
    const url = 'https://your-domain.com/path-to-your-pdf-file.pdf';

    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            document.getElementById('pdfViewer').appendChild(canvas);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    });
</script>

    */



    // $('#prevPage').on('click', function () {
    //     alert("Previous page feature is not implemented in this example.");
    // });

    // // Handle "Next Page" button click
    // $('#nextPage').on('click', function () {
    //     alert("Next page feature is not implemented in this example.");
    // });

    // // Handle "Fullscreen" button click
    // $('#fullscreenToggle').on('click', function () {
    //     const pdfReader = document.getElementById("pdfReader");
    //     if (pdfReader.requestFullscreen) {
    //         pdfReader.requestFullscreen();
    //     } else if (pdfReader.webkitRequestFullscreen) { /* Safari */
    //         pdfReader.webkitRequestFullscreen();
    //     } else if (pdfReader.msRequestFullscreen) { /* IE11 */
    //         pdfReader.msRequestFullscreen();
    //     }
    // });
});