const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const cors = require('cors');
const crypto = require('crypto');
const nftmodel = require('./models/nft');
const collectionmodel = require('./models/collection');
const usermodel = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://pixopolisinfo:pixopolis3535@pixopolis.ioxcyjn.mongodb.net/pixopolis?retryWrites=true&w=majority&appName=pixopolis')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// create user info when connect to wallet 
// Route to create a new user with the provided address

app.post('/createuser', async (req, res) => {
  try {
    const existingUser = await usermodel.findById(req.body._id);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const newUser = await usermodel.create(req.body);
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});

///////////////////////////////////////////////////////////

app.post('/createcollection', async (req, res) => {
  try {
    const collection = await collectionmodel.create(req.body);
    res.json(collection);
    const { address, _id } = req.body;
    await usermodel.findByIdAndUpdate(address, { $push: { collections: _id} }, { new: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createnft', async (req, res) => {
  try {
    const nft = await nftmodel.create(req.body);
    res.json(nft);
    const { collectionid, _id} = req.body;
    await collectionmodel.findByIdAndUpdate(collectionid, { $push: { nfts: _id } }, { new: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// sending collection info of user by his address to the create and collection tabs
app.get("/collection", async (req, res) => {
  try {
    const imageData = await collectionmodel.find({});
    res.json({ status: "ok", data: imageData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/nfts", async (req, res) => {
  try {
    const imageData = await nftmodel.find({});
    res.json({ status: "ok", data: imageData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/userinfo", async (req, res) => {
  try {
    const imageData = await usermodel.find();
    res.json({ status: "ok", data: imageData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
const multer = require("multer");

// nft image upload using multer code 
const storagenft = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../pixelopolis/src/image/nft/");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const uploadnft = multer({ storage: storagenft });

app.post("/upload-nftimage", uploadnft.single("image"), async (req, res) => {
  const imagenftName = req.file.filename;
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }
  res.json({ status: "ok", imageName: imagenftName });
});


// collection image upload using multer code 

const storagecoll = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../pixelopolis/src/image/coll/");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const uploadcoll = multer({ storage: storagecoll });

app.post("/upload-collimage", uploadcoll.single("image"), async (req, res) => {
  const imagecolName = req.file.filename;
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }
  res.json({ status: "ok", imageName: imagecolName });
});

///////////////////////////////////////////////////////////////////////
// user image upload using multer code

const storageuserpro = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../pixelopolis/src/image/user/");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const uploaduserpro = multer({ storage: storageuserpro });

app.post("/uploadprofileimage", uploaduserpro.single("image"), async (req, res) => {
  const imageuserproName = req.file.filename;
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }
  res.json({ status: "ok", imageName: imageuserproName });
});

app.post('/userprofileimage', async (req, res) => {
  try {
    const { id, image } = req.body;
    
    const updateUser = await usermodel.findByIdAndUpdate(id, { profileimage: image }, { new: true });
    
    if (!updateUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('profile image updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

//////////

app.post("/uploadbackgroundimage", uploaduserpro.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }
  const imageuserbackName = req.file.filename;
  res.status(200).json({ status: "ok", imageName: imageuserbackName });
});

app.post('/userbackimage', async (req, res) => {
  try {
    const { id, image } = req.body;

    const updateUser = await usermodel.findByIdAndUpdate(id, { backgroundimage: image }, { new: true });

    
    if (!updateUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Background image updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});
///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


// updating the user info from settings 
app.post('/updateUserInfo', async (req, res) => {
  try {
      const { _id, ...updatedUserInfo } = req.body; // Extract _id separately
      await usermodel.findByIdAndUpdate(_id, updatedUserInfo);
      res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// liking nfts ////////////////////////////////////////

app.post('/like', async (req, res) => {
  try {
      const { _id,like} = req.body;
      await nftmodel.findByIdAndUpdate(_id, { $push: { likes: like} }, { new: true });
      res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/notlike', async (req, res) => {
  try {
      const { _id,like} = req.body;
      await nftmodel.findByIdAndUpdate(_id, { $pull: { likes: like} }, { new: true });
      res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// liking collections ////////////////////////////////////////

app.post('/colllike', async (req, res) => {
  try {
      const { _id,like} = req.body;
      await collectionmodel.findByIdAndUpdate(_id, { $push: { likes: like} }, { new: true });
      res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/collnotlike', async (req, res) => {
  try {
      const { _id,like} = req.body;
      await collectionmodel.findByIdAndUpdate(_id, { $pull: { likes: like} }, { new: true });
      res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

//////////////////////////////////////////////////
//ownerpage follow and unfollow

app.post('/follow', async (req, res) => {
  try {
      const {id,address} = req.body;
      await usermodel.findByIdAndUpdate(id, { $push: { followers: address} }, { new: true });
      await usermodel.findByIdAndUpdate(address, { $push: { following: id} }, { new: true });
      res.status(200).json({ message: "success" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/unfollow', async (req, res) => {
  try {
      const {id,address} = req.body;
      await usermodel.findByIdAndUpdate(id, { $pull: { followers: address} }, { new: true });
      await usermodel.findByIdAndUpdate(address, { $pull: { following: id} }, { new: true });
      res.status(200).json({ message: "success" });

  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

//////////////////////////////////////////////////
//ownerpage follow and unfollow

app.post('/addtocart', async (req, res) => {
  try {
      const {id,address} = req.body;
      await usermodel.findByIdAndUpdate(address, { $push: { cart: id} }, { new: true });

  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/removefromcart', async (req, res) => {
  try {
      const {id,address} = req.body;
      await usermodel.findByIdAndUpdate(address, { $pull: { cart: id} }, { new: true });
      res.status(200).json({ message: "removed" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/removeallcart', async (req, res) => {
  try {
      const {address} = req.body;
      await usermodel.findByIdAndUpdate(address, { $set: {cart: []} }, { new: true });
      res.status(200).json({ message: "removed" });   
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});
//////////////////////////////////////////////////
//editlisting changeing price and expirydate

app.post('/editlistingcontinue', async (req, res) => {
  try {
    const { _id, transactionid, price, date, expirydate } = req.body;
    const nftExists = await nftmodel.exists({ _id });
    if (!nftExists) {
      return res.status(404).json({ message: "NFT not found" });
    }
    const objectIdTransactionId = ObjectId(transactionid);
    const updatedNFT = await nftmodel.findOneAndUpdate(
      { _id, "transaction._id": objectIdTransactionId },
      {
        $set: {
          "transaction.$.price": price,
          "transaction.$.date": date,
          "transaction.$.expirydate": expirydate
        }
      },
      { new: true }
    );

    if (!updatedNFT) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction info updated successfully!" });
  } catch (error) {
    console.error('Error updating transaction info:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////////////////////////////////

app.post('/removelistings', async (req, res) => {
  try {
    const { _id, transactionid, expirydate } = req.body;
    const nftExists = await nftmodel.exists({ _id });
    if (!nftExists) {
      return res.status(404).json({ message: "NFT not found" });
    }
    const objectIdTransactionId = ObjectId(transactionid);
    const updatedNFT = await nftmodel.findOneAndUpdate(
      { _id, "transaction._id": objectIdTransactionId },
      {
        $set: {
          "transaction.$.expirydate": expirydate
        }
      },
      { new: true }
    );

    if (!updatedNFT) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction info updated successfully!" });
  } catch (error) {
    console.error('Error updating transaction info:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//////////////////////////////////////////////////
//list for sale changeing price and expirydate

app.post('/listforsalecontinue', async (req, res) => {
  try {
    const { _id, event, price, date, expirydate,from,to} = req.body;
    const updatedTransaction = {
      event: event,
      price: price,
      from: from,
      to: to,
      date: date,
      expirydate: expirydate
    };

    const updatedNFT = await nftmodel.findByIdAndUpdate(
      _id,
      { $push: { transaction: updatedTransaction } },
      { new: true }
    );

    if (!updatedNFT) {
      return res.status(404).json({ message: "NFT not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully!", updatedNFT });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});
///////////////////////////////////////////////////
// buynow will transfer the ownership of the nft to the client

app.post('/offercontinue', async (req, res) => {
  try {
    const { _id, event, price, date, expirydate,from,to} = req.body;
    const updatedTransaction = {
      event: event,
      price: price,
      from: from,
      to: to,
      date: date,
      expirydate: expirydate
    };

    const updatedNFT = await nftmodel.findByIdAndUpdate(
      _id,
      { $push: { transaction: updatedTransaction } },
      { new: true }
    );

    if (!updatedNFT) {
      return res.status(404).json({ message: "NFT not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully!", updatedNFT });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////////////
// an offer lets you bid on NFTs in a collection

app.post('/buynow', async (req, res) => {
  try {
    const { _id,previousid, event, price,date,from,to} = req.body;
    const updatedTransaction = {
      event: event,
      price: price,
      from: from,
      to: to,
      date: date,
      expirydate: date,
    };

    const updatedNFT = await nftmodel.findByIdAndUpdate(
      _id,
      { $push: { transaction: updatedTransaction }, address: to },
      { new: true }
    );
    const objectIdTransactionId = ObjectId(previousid);
    const updatedNFT1 = await nftmodel.findOneAndUpdate(
      { _id, "transaction._id": objectIdTransactionId },
      {
        $set: {
          "transaction.$.expirydate": date
        }
      },
      { new: true }
    );

    if (!updatedNFT) {
      return res.status(404).json({ message: "NFT not found" });
    }    
    if (!updatedNFT1) {
      return res.status(404).json({ message: "NFT not found 2" });
    }

    res.status(200).json({ message: "Transaction updated successfully!", updatedNFT });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////////////
// update viewcount4

app.post('/updateviewcount', async (req, res) => {
  try {
      const { _id,views} = req.body;
      await nftmodel.findByIdAndUpdate(_id, {views: views }, { new: true });
      res.status(200).json({ message: "viewcountupdated" });
  } catch (error) {
      console.error('Error updating user info:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});


//////////////////////////////////////////////////
//authenicating the user using fingerprint

const generateChallenge = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Endpoint for generating a random challenge
app.get('/generate-challenge', (req, res) => {
  const challenge = generateChallenge();
  res.json({ challenge });
});

// Endpoint for handling fingerprint authentication
app.post('/authenticate', (req, res) => {
  const { credentials, challenge } = req.body;

  // Validate credentials and challenge here
  // For simplicity, let's assume authentication is successful
  if (credentials && challenge) {
    res.json({ success: true, message: 'Fingerprint authentication successful' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials or challenge' });
  }
});