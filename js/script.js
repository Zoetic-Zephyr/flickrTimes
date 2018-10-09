let NYTimesArticles;


function makeHTML(article){
    let headline = "<h2><a href=" + article.web_url + ">" + article.headline.main + "</a></h2>";
    $('#results').append(headline);
}

function makeIMG(imgURL){
    let image = "<div><img src=" + imgURL + "></img></div>";
    $('#results').append(image);
}

function getFlickrData(artObj){
    let apiURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
    let apiKey = "fde2cb10dc10debcc849571de151e000&format=json&nojsoncallback=1&tags=";
    let term;

    if (artObj.headline.main.split(' ')[0].length > 0) {
        term = artObj.headline.main.split(' ')[0];
    } else{
        term = "news";
    }

    let url = apiURL + apiKey + term;
    // console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        error: function(err) {
            console.log("Uh oh???");
            console.log(err);
        },
        success: function (data) {
            console.log("Woohoo!!!");
            // console.log(data);
            let imgObj = data.photos.photo[0];
            let myfarm = imgObj.farm;
            let myserver = imgObj.server;
            let myid = imgObj.id;
            let mysecret = imgObj.secret;

            let imgURL = "https://farm" + myfarm + ".staticflickr.com/" + myserver + "/" + myid + "_" + mysecret + ".jpg";

            makeIMG(imgURL);
            makeHTML(artObj);
        }
    });
    // console.log(artobj.headline);
}


function getNYTimesData(query) {
    // Method below is recommended by NYTimes
    // let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    // url += '?' + $.param({
    // 'api-key': "df10414a5c93429ca88a91291856f7af",
    // 'q': flq,
    // 'fl': "headline"
    // });
    let apiURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=";
    let apikey = "df10414a5c93429ca88a91291856f7af";
    let filter = "&page=0&sort=newest&q=";
    let q = query;

    let url = apiURL + apikey + filter + q;
    console.log(url);
    // console.log(url);
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error : function(err){
            console.log("Uh oh???");
            console.log(err);
        },
        success: function(data) {
            console.log("Woohoo!!!");
            // console.log(data);

            //The things happen after I got the data!
            NYTimesArticles = data.response.docs;
            // console.log(NYTimesArticles);
            
            for (let i = 0; i < NYTimesArticles.length; i++) {
                // console.log(NYTimesArticles[i].headline.main)
                getFlickrData(NYTimesArticles[i]);
            }
            // makeHTML(NYTimesArticles);

        }
    });

    console.log("Waiting...");

}


$(document).ready(function(){
    console.log("Document is Ready!!");
    getNYTimesData("porsche");
});