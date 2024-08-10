const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const authRoutes = require('./routes/authRoutes/auth');
const userRoutes = require('./routes/authRoutes/user');
const staticpagesRoutes = require('./routes/clientRoutes/staticPages');
const adventureRoutes = require('./routes/clientRoutes/adventure');
const newsletterRoutes = require('./routes/clientRoutes/newsletter');
const storyRoutes = require('./routes/clientRoutes/story');
const usersRoutes = require('./routes/clientRoutes/user');
const adventuresAdminRoutes = require('./routes/adminRoutes/adventure');
const newsletterAdminRoutes = require('./routes/adminRoutes/newsletter');
const orderAdminRoutes = require('./routes/adminRoutes/order');
const storyAdminRoutes = require('./routes/adminRoutes/story');
const userAdminRoutes = require('./routes/adminRoutes/user');
const ipnRoutes = require('./routes/ipnRoutes');
const staticPagesAdminRoutes = require('./routes/adminRoutes/staticPages');

const app = express();

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.log('Connection failed', err));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended:false}));
app.use(morgan('combined'));


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/client/static-pages', staticpagesRoutes);
app.use('/api/client/adventure', adventureRoutes);
app.use('/api/client/newsletter', newsletterRoutes);
app.use('/api/client/story', storyRoutes);
app.use('/api/client/user-updates', usersRoutes);
app.use('/api/admin/adventure', adventuresAdminRoutes);
app.use('/api/admin/newsletter', newsletterAdminRoutes);
app.use('/api/admin/order', orderAdminRoutes);
app.use('/api/admin/story', storyAdminRoutes);
app.use('/api/admin/user', userAdminRoutes);
app.use('/api/admin/static-pages', staticPagesAdminRoutes);
app.use('/api/ipn', ipnRoutes);


const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});
