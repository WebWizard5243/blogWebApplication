import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let blogList =[];


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));


app.get("/",(req,res) => {
   res.render("index.ejs",{
    blogList : blogList, 
});
});
app.post("/compose",(req,res) => {
    res.render("compose.ejs",{
        edit : false,
    });
});
app.post("/",(req,res) => {
    const blogTitle = req.body["title"];
    const blogContent = req.body["content"];
    blogList.push({
        id : generateId(),
        title : blogTitle,
        description : blogContent,
    });
    res.render("index.ejs",{blogList : blogList});
});

function generateId(){
    return Math.floor(Math.random()*10000);
}
app.get("/blogDetails/:id",(req,res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    res.render("blogDetails.ejs", {
        blogDetails: blogDetails,
      });
});

app.get("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    res.render("compose.ejs", {
      isEdit: true,
      blogDetails: blogDetails,
    });
  });

  app.post("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));

  if (editBlog === -1) {
    return res.send("<h1> Something went wrong </h1>"); // Use return for cleaner error handling
  }

  const updatedTitle = req.body["title"];
  const updatedDescription = req.body["content"];

  blogList[editBlog].title = updatedTitle;
  blogList[editBlog].description = updatedDescription;

  res.redirect('/');
});

app.get("/delete/:id", (req, res) => {
    const blogId = req.params.id;
    blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
    res.send(
      '<script>alert("Blog deleted successfully"); window.location="/";</script>'
    );
    res.redirect("/");
  });
app.listen(port,() => {
    console.log(`this server is running on port ${port}.`);
});