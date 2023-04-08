const { set } = require("mongoose");
const { registerMongooseDocumentArray } = require("mongoose/lib/utils");
const Hotels = require("../models/hotels");
const Rooms = require("../models/room");

const Transaction = require("../models/transaction");
// const result = (hanoi, hcm, danang) => {
//   return [
//     { Hanoi: hanoi, total: hanoi.length },
//     { hcm: hcm, total: hcm.length },
//     { dn: hcm, total: hcm.length },
//   ];
// };
exports.getHotelsid = async (req, res, next) => {
  const id = req.query.id;
  const results = [];
  const hotel = await Hotels.findOne({ _id: id });
  // const room = await Rooms.find();
  // hotel.rooms.forEach((a) => {
  //   room.forEach((b) => {
  //     if (a._id.toString() == b._id.toString()) results.push(b);
  //   });
  // });

  // console.log(results);
  res.status(200).send({ data: hotel });
};
exports.getOrderRoom = async (req, res, next) => {
  console.log("getorder room đang chạy");
  const id = req.query.id;
  // console.log(req.query.id);
  const dateStart = new Date(req.body.data.a);
  dateStart.setDate(dateStart.getDate() + 1);
  const dateEnd = new Date(req.body.data.b);
  dateEnd.setDate(dateEnd.getDate() + 1);
  const results = [];
  const hotel = await Hotels.findOne({ _id: id });
  // console.log(hotel);
  const room = await Rooms.find();
  const transactions = await Transaction.find();
  // console.log(room[0]._id.toString());
  // console.log(hotel);
  const transaction = [];
  // lấy ra transaction có id hotels đang book
  transactions.forEach((a) => {
    if (a.hotel._id.toString() === id.toString()) {
      transaction.push(a);
    }
  });
  //tìm các phòng có trong hotels đưa vào biến result
  hotel.rooms.forEach((a) => {
    room.forEach((b) => {
      // console.log(a);
      if (a.toString() == b._id.toString()) results.push(b);
    });
  });
  transaction.forEach((a) => {
    if (
      a.dateEnd >= dateStart > a.dateStart ||
      (dateEnd >= a.dateStart && dateStart <= a.dateEnd)
    ) {
      a.rooms.forEach((b) => {
        // console.log(b);
        results.forEach((c) => {
          if (c.roomNumbers.indexOf(b) !== -1) {
            c.roomNumbers.splice(c.roomNumbers.indexOf(b), 1);
          }
        });
      });
    }
  });
  // console.log(results);

  res.status(200).send({ rooms: results });
};
exports.getTrans = async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  Transaction.find({ user_id: id })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(results);
};
exports.getHotels = (req, res, next) => {
  Hotels.find()
    .then((hotels) => {
      res.status(200).send(hotels);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getbook = (req, res, next) => {
  console.log(req.body);
  const book = req.body;
  const dateStart = new Date(book.dateStart);
  dateStart.setDate(dateStart.getDate() + 1);
  const dateEnd = new Date(book.dateEnd);
  dateEnd.setDate(dateEnd.getDate() + 1);
  book.dateStart = dateStart;
  book.dateEnd = dateEnd;
  const trans = new Transaction(book);
  trans
    .save()
    .then((results) => {
      res.status(200).send(JSON.stringify({ results: [], message: "SUCCESS" }));
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.search = async (req, res, next) => {
  console.log(req.query);
  const city = req.query.city;
  const dateStart = new Date(req.query.dateStart);

  const dateEnd = new Date(req.query.dateEnd);

  const maxPeoples = req.query.maxpeople;
  const roomorder = req.query.room;
  const room = await Rooms.find();
  // room thảo mãn maxpople
  const roomok = [];
  room.forEach((a) => {
    if (a.maxPeople >= maxPeoples && a.roomNumbers >= roomorder) {
      // console.log(a);
      roomok.push({ id: a._id.toString(), number: a.roomNumbers });
    }
  });
  // console.log(roomok);

  const roomsearch = [];
  const hotels = await Hotels.find({ city: city });
  hotels.forEach((a) => {
    a.rooms.forEach((b) => {
      roomok.forEach((c) => {
        // console.log(c.id.includes(b.toString()));
        if (c.id.includes(b.toString())) {
          const idhotel = { idhotel: a._id.toString() };

          roomsearch.push(Object.assign({}, c, a));
        }
      });
    });
  });
  // console.log(roomsearch);
  // roomsearch=[idroom , numberroom, idhotel]
  // vào transaction tìm tran nào có idhotel trùng=>> kiểm tra ngày đặt nếu trùng=>> kiểm tra số phòng xem tr
  //trùng không nếu trùng=>> xóa ra khỏi roomsearch
  // console.log(roomsearch);
  const transactions = await Transaction.find();
  transactions.filter((trans) => {
    return roomsearch.forEach((rs) => {
      return trans.hotel._id.toString() === rs.idhotel;
    });
  });
  // console.log(transactions);
  transactions.forEach((trans) => {
    // console.log(trans.dateEnd >= dateStart, trans.dateEnd, dateStart);
    if (
      trans.dateEnd >= dateStart > trans.dateStart ||
      (dateEnd >= trans.dateStart && dateStart <= trans.dateEnd)
    ) {
      console.log(trans);
      trans.rooms.forEach((tran) => {
        roomsearch.forEach((room, i) => {
          if (room._doc._id.toString() === trans.hotel._id.toString()) {
            // console.log(room.number.includes(tran), i);
            room.number.includes(tran)
              ? room.number.splice(room.number.indexOf(tran), 1)
              : "";
          }
        });
      });
    }
  });
  // console.log(transactions);
  const result = roomsearch.filter((room) => {
    console.log(room.number.length >= roomorder);
    return room.number.length >= roomorder;
  });
  // console.log(result);

  // console.log(roomsearch.length);
  res.status(200).send(result);
};
