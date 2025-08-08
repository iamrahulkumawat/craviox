const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { createReadStream } = require('fs');
const cors = require("cors");

const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 9000;


const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));


app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const supabaseUrl = 'https://aydsvsilmozvbawymrov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHN2c2lsbW96dmJhd3ltcm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MDM2NTYsImV4cCI6MjAzNDM3OTY1Nn0.JWgxWPd2_4zZvXnY3UVcAX71hDOcC0YfEWKWpypcOHk';
const supabase = createClient(supabaseUrl, supabaseKey);

const id = '96b59781-51ba-458b-af7c-49beeed054a0';

app.get('/', async (req, res) => {
  try {
    const { data: blogs, error: blogsError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('userId', id)
      .limit(6);
    if (blogsError) {
      console.error('Error fetching blogs:', blogsError);
      return res.status(500).send('Internal Server Error');
    }

    const { data: allPortfolios, error: portfolioError } = await supabase
      .from('portfolio_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('userId', id)
      .limit(9);

    const { data: webServices, error: webServicesError } = await supabase
      .from('web_services')
      .select('*')
      .eq('userId', id);

    const { data: additionalServices, error: additionalServicesError } = await supabase
      .from('additional_services')
      .select('*');

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('userId', id);

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (portfolioError || webServicesError || additionalServicesError || contactsError || categoriesError) {
      console.error(
        'Error fetching data:',
        portfolioError,
        webServicesError,
        additionalServicesError,
        contactsError,
        categoriesError
      );
      return res.status(500).send('Internal Server Error');
    }

    const portfoliosWithCategories = allPortfolios.map(portfolio => {
      const category = categories.find(cat => cat.id === portfolio.category_id);
      const categoryTitle = category ? category.title : 'Uncategorized'; 

      return {
        ...portfolio,
        category: categoryTitle
      };
    });

    res.render('User/index', {
      blogs,
      allPortfolios: portfoliosWithCategories,
      webServices,
      additionalServices,
      contacts, 
      settings
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/portfolio/:portfolioId', async (req, res) => {
  const portfolioId = req.params.portfolioId;

  try {
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio_posts')
      .select('*')
      .eq('id', portfolioId)
      .eq('userId', id)
      .single();
  
    if (portfolioError) {
      console.error('Error fetching portfolio:', portfolioError);
      return res.status(500).send('Internal Server Error');
    }
  
    if (!portfolio) {
      return res.status(404).send('Portfolio not found');
    }
  
    const { data: content, error: contentError } = await supabase
      .from('portfolio_posts')
      .select('*')
      .eq('id', portfolioId)
      .eq('userId', id);
  
    if (contentError) {
      console.error('Error fetching portfolio content:', contentError);
      return res.status(500).send('Internal Server Error');
    }
  
    const productImages = portfolio.images || [];
   
    let nextPortfolioId = null;
    let nextPortfolioTitle = '';
    let nextPortfolioCoverImage = '';
  
    const { data: nextPortfolio, error: nextPortfolioError, count: nextPortfolioCount } = await supabase
      .from('portfolio_posts')
      .select('id, title, cover_image', { count: 'exact', head: true })
      .gt('id', portfolioId)
      .order('id', { ascending: true })
      .eq('userId', id)
      .limit(1)
      .single();
  
    if (nextPortfolioError) {
      console.error('Error fetching next portfolio:', nextPortfolioError);
    } else if (nextPortfolioCount === 1 && nextPortfolio) {
      nextPortfolioId = nextPortfolio.id;
      nextPortfolioTitle = nextPortfolio.title;
      nextPortfolioCoverImage = nextPortfolio.cover_image;
    }
    const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .eq('userId', id);

    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);
    res.render('User/single-project-1', {
      content,
      portfolio,
      productImages,
      nextPortfolioId,
      nextPortfolioTitle,
      contacts,
      nextPortfolioCoverImage,
      settings
    });
  } catch (error) {
    console.error('Error fetching portfolio details:', error);
    res.status(500).send('Internal Server Error');
  } 
});



app.get('/show_blog/:blogId', async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const { data: blog, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, coverImage, title, category, created_at, content')
      .eq('id', blogId)
      .eq('userId', id)
      .single();

    if (blogError) {
      console.error('Error fetching blog:', blogError);
      return res.status(500).send('Internal Server Error');
    }

    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('userId', id);


    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    const { data: content, error: contentError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', blogId)
      .eq('userId', id);

    if (contentError) {
      console.error('Error fetching blog content:', contentError);
      return res.status(500).send('Internal Server Error');
    }

const { data: comments, error: commentsError } = await supabase
.from('comments')
.select(`*, replies(id, reply, created_at)`)
.eq('blog_id', blogId)
.eq('userId', id);

if (commentsError) {
console.error('Error fetching comments:', commentsError);
return res.status(500).send('Internal Server Error');
}
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    const { data: nextBlog, error: nextBlogError, count: nextBlogCount } = await supabase
      .from('blog_posts')
      .select('id, title', { count: 'exact', head: true })
      .gt('id', blogId)
      .order('id', { ascending: true })
      .eq('userId', id)
      .limit(1)
      .single();

    const { data: prevBlog, error: prevBlogError, count: prevBlogCount } = await supabase
      .from('blog_posts')
      .select('id, title', { count: 'exact', head: true })
      .lt('id', blogId)
      .order('id', { ascending: false })
      .eq('userId', id)
      .limit(1)
      .single();

    if (nextBlogError || prevBlogError) {
      console.error('Error fetching next/prev blog:', nextBlogError, prevBlogError);
    }

    const nextBlogId = nextBlogCount === 1 && nextBlog ? nextBlog.id : null;
    const prevBlogId = prevBlogCount === 1 && prevBlog ? prevBlog.id : null;
    const nextBlogTitle = nextBlogCount === 1 && nextBlog ? nextBlog.title : '';
    const prevBlogTitle = prevBlogCount === 1 && prevBlog ? prevBlog.title : '';

    res.render('User/blog-post', {
      blog,
      content,
      blogId,
      comments,
      contacts,
      nextBlogId,
      prevBlogId,
      nextBlogTitle,
      settings,
      prevBlogTitle,
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/portfolio-page', async(req, res) => {
  try {
    const { data: allPortfolios, error } = await supabase
      .from('portfolio_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('userId', id)
      

    if (error) {
      console.error('Error fetching portfolios:', error);
      return res.status(500).send('Internal Server Error');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    res.render('User/portfolio-grid-creative', { allPortfolios, contacts, settings });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/allBlogs', async(req, res) => {
  try {
    const { data: blogs, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('userId', id);

    if (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).send('Internal Server Error');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);
    res.render('User/blog-classic', { blogs, contacts, settings });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/about-us', async (req, res) => {
  try {
    const { data: webServices, error: webServicesError } = await supabase
      .from('web_services')
      .select('*')
      .eq('userId', id);

    const { data: additionalServices, error: additionalServicesError } = await supabase
      .from('additional_services')
      .select('*')
      .eq('userId', id);

    const { data: aboutData, error: aboutDataError } = await supabase
      .from('about_us')
      .select('*')
      .eq('userId', id);

    if (webServicesError || additionalServicesError || aboutDataError) {
      console.error('Error fetching data:', webServicesError, additionalServicesError, aboutDataError);
      return res.status(500).send('Internal Server Error');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    if (aboutData.length === 0) {
      console.warn('about_us table is empty');
      return;
    } else if (aboutData.length > 1) {
      console.warn('Multiple rows found in about_us table');
      return res.render('User/about-us', { webServices, additionalServices, aboutData: aboutData[0] });
    }

    res.render('User/about-us', { webServices, additionalServices, aboutData: aboutData[0], contacts, settings });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/privacy_policy', async (req, res) => {
  try {
    const { data: privacyData, error } = await supabase
      .from('privacy')
      .select('*')
      .order('id', { ascending: false })
      .eq('userId', id)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching privacy policy:', error);
      return res.status(500).send('Internal Server Error');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    res.render('User/privacy_policy', { privacyData, contacts, settings });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get("/industries", async (req, res) => {
  try {
    const { data: industries, error } = await supabase
      .from('industry')
      .select('*')
      .eq('userId', id);

    if (error) {
      console.error('Error fetching industries:', error);
      return res.status(500).send('Internal Server Error');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    res.render('User/industries', { industries, contacts, settings });
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/industry_detail/:id', async (req, res) => {
  try {
    const industryId = req.params.id;
    const { data: industry, error } = await supabase
      .from('industry')
      .select('*')
      .eq('id', industryId)
      .eq('userId', id)
      .single();

    if (error) {
      console.error('Error fetching industry:', error);
      return res.status(500).send('Internal Server Error');
    }

    if (!industry) {
      return res.status(404).send('Industry not found');
    }
    const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('userId', id);
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', id);

    res.render('User/industry_detail', { industry, contacts, settings });
  } catch (error) {
    console.error('Error fetching industry details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/contact', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('userId', id);

    if (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).send('Internal Server Error');
    }
    
    const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .eq('userId', id);
    
    res.render('User/contact', { contacts, settings });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/query', async (req, res) => {
  console.log(req.body); 
  try {
    const { name, email, subject, option, message } = req.body;
    const { data, error } = await supabase
      .from('contact_mail')
      .insert({ name, email, subject, option, message, userId: id });
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      res.status(200).json({ message: 'Form submitted successfully' });
    }
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ error: 'Error processing form' });
  }
});

app.post('/comment', async (req, res) => {
  console.log(req.body); 
  try {
    const { name, email, comment, blog_id } = req.body;
    const { data, error } = await supabase
      .from('comments')
      .insert({ name, email, comment, blog_id, userId: id });
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      res.status(200).json({ message: 'Form submitted successfully' });
    }
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ error: 'Error processing form' });
  }
});


