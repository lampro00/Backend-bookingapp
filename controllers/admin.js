const User = require("../models/user");
const Transaction = require("../models/transaction");
const Hotels = require("../models/hotels");
const Room = require("../models/room");
let userlogin = "";
exports.login = (req, res, next) => {
  console.log(req.query);
  User.find({
    username: req.query.userName,
    password: req.query.password,
  })
    .then((user) => {
      console.log(user[0]);
      if (user[0]) {
        (req.user = user), res.status(200).send({ data: user });
        res.redirect("/");
      } else res.status(400).send("fgfdgfdk");
    })
    .catch((err) => console.log(err));
};
exports.singup = (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const std = req.body.std;
  const username = req.body.username;
  console.log(req.body);
  // const password = req.query.password;

  const users = new User({
    email: email,
    password: password,
    phoneNumber: std,
    fullName: fullName,
    username: username,
  });
  User.find({
    username: username,
  }).then((user) => {
    console.log(user.length);
    if (user.length !== 0) {
      res.status(200).send({ message: "notok" });
      console.log("đã trùng");
      //  next();
    } else {
      users
        .save()
        .then((user) => {
          console.log(user);
          console.log("tao product");
          res.status(200).send({ message: "ok" });
        })
        .catch((err) => console.log(err));
    }
  });
};
exports.getAdminpage = async (req, res, next) => {
  const results = [];
  const user = await User.find();

  const transaction = await Transaction.find();
  const transorder = transaction.length;
  let earnings = 0;
  let datemax = new Date();

  let datemin = new Date();
  datemin.setDate(11);
  datemin.setMonth(00);
  datemin.setFullYear(2023);
  transaction.forEach((trans) => {
    // console.log(trans.datebook);
    earnings += trans.price;
    trans.datebook > datemax ? (datemax = trans.datebook) : "";
  });
  let blance = 0;

  if (
    parseInt(datemax.getTime() - datemin.getTime() + 1) / (24 * 3600 * 1000) <=
    30
  )
    blance = earnings;
  else
    blance =
      earnings /
      (parseInt(datemax.getTime() - datemin.getTime() + 1) /
        (24 * 3600 * 1000) /
        30);
  transaction.splice(8, transaction.length - 8);
  res.status(200).send({
    Trans: transaction,
    user: user.length - 1,
    order: transorder,
    earnings: earnings,
    blance: blance.toFixed(2),
  });
};
exports.gettrans = async (req, res, next) => {
  const results = [];
  const user = await User.find();

  const transaction = await Transaction.find();
  const transorder = transaction.length;

  res.status(200).send({
    Trans: transaction,
  });
};
exports.postDeletehotel = async (req, res, next) => {
  console.log("deletehotels đang chạy");
  const id = req.query.id;
  const a = [];
  console.log(id);
  const transaction = await Transaction.find();
  transaction.forEach((tr) => {
    tr.hotel._id.toString() == id.toString() ? a.push(tr) : a;
  });
  // console.log(a);

  if (a.length !== 0) {
    console.log("deletehotels khóng xóa dc");
    res.status(200).send({ message: "notok" });
  } else {
    console.log("deletehotels đang xóa");
    Hotels.findByIdAndRemove(id).then((result) => {
      res.status(200).send({ message: "ok" });
    });
  }
};

exports.getHotels = (req, res, next) => {
  console.log("get hotel đang chạy");
  Hotels.find()
    .then((hotels) => {
      res.status(200).send(hotels);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getIdHotels = (req, res, next) => {
  console.log("getidhotels chạy");
  const id = req.query.id;
  console.log(id);
  Hotels.find({ _id: id })
    .then((hotels) => {
      res.status(200).send(hotels);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getRooms = (req, res, next) => {
  console.log("get room đang chạy");
  Room.find()
    .then((rooms) => {
      res.status(200).send(rooms);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addhotels = (req, res, next) => {
  console.log("add hotel đang chạy");
  console.log(req.body);
  const hotel = req.body;
  if (hotel.featured === "true") hotel.featured = true;
  if (hotel.featured === "false") hotel.featured = false;
  const hotels = new Hotels(hotel);

  hotels.rooms.map((a) => {
    return a._doc;
  });
  hotels
    .save()
    .then((results) => {
      res.status(200).send(JSON.stringify({ results: [], message: "SUCCESS" }));
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.edithotels = (req, res, next) => {
  const id = req.query.id;
  console.log("edit hotel đang chạy", id);
  console.log(req.body);
  const updatehotel = req.body;
  if (updatehotel.featured === "true") updatehotel.featured = true;
  if (updatehotel.featured === "false") updatehotel.featured = false;
  updatehotel.rooms.map((a) => {
    return a._doc;
  });
  Hotels.findById(id)
    .then((hotel) => {
      (hotel.name = updatehotel.name),
        (hotel.type = updatehotel.type),
        (hotel.city = updatehotel.city),
        (hotel.address = updatehotel.address),
        (hotel.distance = updatehotel.distance),
        (hotel.photos = updatehotel.photos),
        (hotel.desc = updatehotel.desc),
        (hotel.featured = updatehotel.featured),
        (hotel.rooms = updatehotel.rooms),
        (hotel.title = updatehotel.title),
        (hotel.cheapestPrice = updatehotel.cheapestPrice);
      return hotel.save();
    })
    .then((results) => {
      res
        .status(200)
        .send(JSON.stringify({ results: [results], message: "SUCCESS" }));
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.Addrooms = (req, res, next) => {
  console.log("add room đang chạy");
  console.log(req.body);
  const room = req.body.data;
  const rooms = new Room({
    title: room.title,
    price: room.price,
    maxPeople: room.maxPeople,
    desc: room.desc,
    roomNumbers: room.rooms,
  });
  rooms
    .save()
    .then((results) => {
      res.status(200).send(JSON.stringify({ results: [], message: "SUCCESS" }));
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postdeleteroom = async (req, res, next) => {
  console.log("deleterom đang chạy");
  const id = req.query.id;
  // const a = [];
  // console.log(id);
  // const transaction = await Transaction.find();
  // transaction.forEach((tr) => {
  //   tr.hotel._id.toString() == id.toString() ? a.push(tr) : a;
  // });
  // // console.log(a);

  // if (a.length !== 0) {
  //   console.log("deletehotels khóng xóa dc");
  //   res.status(200).send({ message: "notok" });
  // } else {
  console.log("deletehotels đang xóa");
  Room.findByIdAndRemove(id).then((result) => {
    res.status(200).send({ message: "ok" });
  });
  // }
};
exports.getIdRoom = (req, res, next) => {
  console.log("idroom chạy");
  const id = req.query.id;
  console.log(id);
  Room.find({ _id: id })
    .then((room) => {
      res.status(200).send(room);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.editRoom = (req, res, next) => {
  const id = req.query.id;
  console.log("edit room đang chạy", id);
  console.log(req.body);
  const updateroom = req.body;
  // console.log(updateroom);
  // updateroom.hotels.forEach((a) => {
  //   Hotels.findById(a).then((re) => {
  //     re.rooms = [...a];
  //     return re.save();
  //   });
  // });
  Room.findById(id)
    .then((room) => {
      (room.maxPeople = updateroom.maxpeople),
        (room.desc = updateroom.desc),
        (room.roomNumbers = updateroom.roomNumbers),
        (room.title = updateroom.title),
        (room.price = updateroom.price);
      return room.save();
    })
    .then((results) => {
      res
        .status(200)
        .send(JSON.stringify({ results: [results], message: "SUCCESS" }));
    })
    .catch((err) => {
      console.log(err);
    });
};
