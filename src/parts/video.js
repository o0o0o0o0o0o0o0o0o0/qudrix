function lazyLoadVideo() {
    let lazyVideos = [...document.querySelectorAll("video")];
    
    lazyVideos.forEach(item => {
        let src = item.querySelector('source');
        let dataSrc = src.getAttribute('data-src');

        if (!dataSrc) {
            item.parentElement.remove();
        }
    });

    if ("IntersectionObserver" in window) {
    let lazyVideoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(video) {
        if (video.isIntersecting) {
            for (let source in video.target.children) {
            let videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
            }
            }
            
            // video.tareget.load only if it's not loaded
            if (!video.target.classList.contains('loaded')) {
                video.target.load();
                console.log('loading')
            }

            video.target.classList.add("loaded");
            video.target.classList.remove("lazy");
        } else {
            video.target.pause();
            // check if video paused and remove loaded class
            if (video.target.paused) {
                console.log('paused')
            }
        }
        });
    });

    lazyVideos.forEach(function(lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
    });
    }
}

export default lazyLoadVideo;