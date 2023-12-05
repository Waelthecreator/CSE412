const express = require("express");
const {Pool} = require("pg");
const resRouter = express.Router();


const pool = new Pool({
    
});

resRouter.get("", async (req,res) =>{
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT name, address, phone_number, AVG(rating) FROM restaurant, review WHERE restaurant.restaurantid = review.restaurantid GROUP BY name,address,phone_number;");
        client.release();
        res.json({"mes1":result.rows});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
    
})
resRouter.get("/time/:day/:time", async(req,res) =>{
    try {
        const {day, time} = req.params;
        const client = await pool.connect();
        const result = await client.query(`SELECT name, address, phone_number, AVG(rating)
         FROM restaurant, hours,review where hours.restaurantid = restaurant.restaurantid and day = '${day}' and '${time}'
          BETWEEN hours.open_time and hours.close_time and restaurant.restaurantid = review.restaurantid
          GROUP BY name,address,phone_number;`);
        client.release();
        res.json({"mes1":result.rows});
    }
    catch (err) {
        console.log(err);
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
});
resRouter.get("/promo", async (req,res) =>{
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT name, address, phone_number, AVG(rating) FROM restaurant,menu,review where restaurant.restaurantid = menu.restaurantid and menu.promotions = true and restaurant.restaurantid = review.restaurantid GROUP BY name, address, phone_number;");
        client.release();
        res.json({"mes1":result.rows});
    }
    catch (err) {
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
})

resRouter.get("/:id", async (req,res) =>{
    try {
        const name = req.params.id;
        const client = await pool.connect();
        const result = await client.query(`SELECT name, address, phone_number from restaurant where name = '${name}';`);
        const menu = await client.query(`SELECT item.name, description,cost from item, menu_item,restaurant where restaurant.name = '${name}' and 
        restaurant.restaurantid = menu_item.restaurantid and menu_item.itemid = item.itemid;`);
        const hours = await client.query(`SELECT day,open_time,close_time from restaurant,hours where restaurant.name = '${name}' and restaurant.restaurantid = hours.restaurantid;`);
        const avgrating = await client.query(`SELECT AVG(rating) from review,restaurant where restaurant.restaurantid = review.restaurantid and restaurant.name = '${name}'`)
        client.release();
        res.json({"info":result.rows, "menu":menu.rows, "hours":hours.rows, "rating": avgrating.rows});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
})
resRouter.get("/rating/:id",async (req,res) =>{
    try {
        const name = req.params.id;
        const client = await pool.connect();
        const result = await client.query(`
        select customer.name, description,rating from customer,review,restaurant 
        where restaurant.restaurantid = review.restaurantid and customer.customerid = review.customerid
        and restaurant.name = '${name}';`);
        client.release();
        res.json({"mes1":result.rows});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
    
})
resRouter.post("/rating", async(req,res) =>{
    const {review,rating,number,name} = req.body;
    try {
        const client = await pool.connect();
        const custquery = await client.query(`select customerid from customer where phone_number = '${number}';`);
        const custid = custquery.rows[0]["customerid"]
        const resquery = await client.query(`select restaurantid from restaurant where name = '${name}';`);
        const resid = resquery.rows[0]["restaurantid"];
        const currentDate = new Date();
        const insert =  await client.query(`INSERT INTO Review(restaurantid, customerid, description, rating, date) VALUES 
        (${resid},${custid},'${review}',${rating},'${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(currentDate.getDate()).padStart(2, '0')}');`);
        client.release();
        res.json({"mes1":"success"});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
})

resRouter.get("/reservation/:id", async (req,res) =>{
    try {
        const number = req.params.id;
        const client = await pool.connect();
        const result = await client.query(`
        select restaurant.name, reservation.date, reservation.time, reservation.size from restaurant, customer, reservation 
        where customer.customerid = reservation.customerid and 
        restaurant.restaurantid = reservation.restaurantid and
        customer.phone_number = '${number}';`);
        res.json({"mes" : result.rows});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }

});

resRouter.post("/reservation", async(req,res) =>{
    const {name, date,time,size,number} = req.body;
    try {
        const client = await pool.connect();
        const custquery = await client.query(`select customerid from customer where phone_number = '${number}';`);
        const custid = custquery.rows[0]["customerid"]
        const resquery = await client.query(`select restaurantid from restaurant where name = '${name}';`);
        const resid = resquery.rows[0]["restaurantid"];
        const query = await client.query(`INSERT INTO Reservation(restaurantid, customerid, date, time, size) VALUES 
        (${resid},${custid},'${date}','${time}',${size});`)
        res.json({mes:"success"});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }

})

resRouter.delete("/reservation/:number/:name",async(req,res) =>{
    const {number,name} = req.params;
    try{
        const client = await pool.connect();
        const custquery = await client.query(`select customerid from customer where phone_number = '${number}';`);
        const custid = custquery.rows[0]["customerid"]
        const resquery = await client.query(`select restaurantid from restaurant where name = '${name}';`);
        const resid = resquery.rows[0]["restaurantid"];
        const qry = await client.query(`DELETE from reservation where customerid = ${custid} and restaurantid = ${resid}; `)
        res.json({mes: "success"});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
    
});

resRouter.delete("/rating/:number/:name", async (req,res) =>{
    const {number,name} = req.params;
    try{
        const client = await pool.connect();
        const custquery = await client.query(`select customerid from customer where phone_number = '${number}';`);
        const custid = custquery.rows[0]["customerid"]
        const resquery = await client.query(`select restaurantid from restaurant where name = '${name}';`);
        const resid = resquery.rows[0]["restaurantid"];
        const qry = await client.query(`DELETE from review where customerid = ${custid} and restaurantid = ${resid}; `)
        res.json({mes: "success"});
    }
    catch (err) {
        console.log(err)
        res.statusCode = 400;
        res.json({mes:"ERROR"});
    }
});
module.exports = resRouter;