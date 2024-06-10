const SerialPort = require("serialport").SerialPort;
const Readline = require("@serialport/parser-readline").ReadlineParser;
const express = require("express");
const app_port = 3001;
const app = express();
app.use(express.json());

// Khởi tạo parser

app.get("/rs232", (req, res) => {
    try {
        console.log("get");
        // Thiết lập cổng nối tiếp
        const port = new SerialPort({
            path: "COM11", // Thay 'COM1' bằng cổng COM của bạn
            baudRate: 9600,
            parity: "none",
            stopBits: 1,
            dataBits: 8,
            autoOpen: false,
        });

        // SerialPort.list().then(ports => {
        //     ports.forEach(port => {
        //       const serialPort = new SerialPort(port.path, { autoOpen: false });
        //       serialPort.open(err => {
        //         if (err) {
        //           console.log(`${port.path} is not in use`);
        //         } else {
        //           console.log(`${port.path} is in use`);
        //           serialPort.close(); // Đóng cổng sau khi kiểm tra
        //         }
        //       });
        //     });
        //   }).catch(err => {
        //     console.error(err);
        //   });

        // Sử dụng parser để đọc dòng dữ liệu
        const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
        // console.log("🚀 ~ parser:", port)

        // Mở cổng nối tiếp
        port.open(function (err) {
            if (err) {
                return console.log("Lỗi khi mở cổng:", err.message);
            }
            console.log("Cổng nối tiếp đã mở");
        });

        port.write("main screen turn on", function (err) {
            if (err) {
                return console.log("Error on write: ", err.message);
            }
            console.log("message written");
        });

        res.send(
            // Xử lý dữ liệu nhận được từ cân
            parser.on("data", function (data) {
                console.log("1", data);
                console.log("🚀 ~ data.indexOf('US,NT,+'):", data.indexOf("US,NT,+") === -1);
                console.log("🚀 ~ data.indexOf('ST,NT,+'):", data.indexOf("ST,NT,+") === -1);

                if (data.indexOf("ST,NT,+") === -1 || data.indexOf("US,NT,+") === -1) {
                    console.log("Trọng lượng đo được:", data.replaceAll("ST,NT,+", "").replaceAll("US,NT,+", "").replaceAll("kg", ""));
                } else {
                    console.log("Lỗi");
                }

                // Đóng cổng nối tiếp khi nhận được dữ liệu
                // port.close(function (err) {
                //   if (err) {
                //     return console.log("Lỗi khi đóng cổng:", err.message);
                //   }
                //   console.log("Cổng nối tiếp đã đóng");
                // });
            })
        );
    } catch (error) {
        console.log("Lỗi");
    }
});

app.get("/abc", (req, res) => {
    res.send("Hello World!");
});

app.get("/test", (req, res) => {
    res.send("Hello World! This is testing");
});
app.get("/test2", (req, res) => {
    res.send("Hello World! This is testing");
});

app.listen(app_port, () => {
    console.log(`Example app listening on port ${app_port}`);
});
