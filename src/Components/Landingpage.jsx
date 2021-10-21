import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import styles from "./myStyle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  BsImageFill,
  BsCollectionPlayFill,
  BsFillFileTextFill,
} from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";

export default function Landingpage() {
  const [available, setAvailable] = useState(0);
  const [used, setUsed] = useState(0);
  const [dir, setDir] = useState("");

  const [imagecount, setImagecount] = useState(0);
  const [imagesize, setImagesize] = useState(0.0);

  const [videocount, setVideocount] = useState(0);
  const [videosize, setVideosize] = useState(0.0);

  const [doccount, setDoccount] = useState(0);
  const [docsize, setDocsize] = useState(0.0);

  const [textcount, setTextcount] = useState(0);
  const [textsize, setTextsize] = useState(0.0);

  const [excelcount, setExcelcount] = useState(0);
  const [excelsize, setExcelsize] = useState(0.0);

  useEffect(() => {
    axios.get("http://localhost:8088/getstatus").then((response) => {
      setAvailable(response.data.available);
      setUsed(response.data.used);
    });
  }, []);

  console.log("available  " + available + " used " + used);

  //-------------------------------- onChange/onPaste Handler ----------------------------------------------
  const onChangeHandler = (event) => {
    setDir(event.target.value);
  };

  //-------------------------------- onClick Handler -----------------------------------------------
  const obClickHandler = (e) => {
    e.preventDefault();
    console.log("before encoding: " + dir);
    var encodedDir = Buffer.from(dir).toString("base64");
    console.log("after encoding: " + encodedDir);
    axios
      .get("http://localhost:8088/getFilecountBy?dir=" + encodedDir)
      .then((response) => {
        console.log(response.data);

        //----- image -------
        setImagecount(response.data.image.fileCount);
        setImagesize(response.data.image.fileSize);

        //------ Video ------------
        setVideocount(response.data.video.fileCount);
        setVideosize(response.data.video.fileSize);

        //------- Doc -------------
        setDoccount(response.data.document.fileCount);
        setDocsize(response.data.document.fileSize);

        //------- text --------------------
        setTextcount(response.data.text.fileCount);
        setTextsize(response.data.text.fileSize);

        //--------- excel -------------------
        setExcelcount(response.data.excel.fileCount);
        setExcelsize(response.data.excel.fileSize);
      });
  };

  //------------------------------- for Donut Chat -----------------------------------------------------------
  const options = {
    colors: ["#4ef26e", "#f57f7f"],
    labels: ["available", "used"],
    tooltip: {
      theme: "dark",
    },
  };
  const series = [available, used];

  //------------------------------ for Bar Chart ----------------------------------------------------------------
  const barOptions = {
    chart: {
      id: "basic-bar",
      colors: ["#17a653", "#66a7f2", "#f2cf66", "#fa7ddd", "#b9fa7d"],
    },
    colors: ["#17a653", "#66a7f2", "#f2cf66", "#fa7ddd", "#b9fa7d"],
    xaxis: {
      categories: ["Image", "Video", "Document", "Text", "Excel"],
    },
  };

  const barSerise = [
    {
      name: "File Count",
      data: [imagecount, videocount, doccount, textcount, excelcount],
    },
  ];

  //------------------------------ return function ----------------------------------------------------------------

  return (
    <div>
      <div className={styles.myheader}>Available Disk Space</div>
      <div>
        <Container fluid="md">
          <Row>
            <Col xs={12} md={6}>
              <div>
                <strong>Available vs Used Space of Root Directory(GB)</strong>
              </div>
              <Chart
                options={options}
                series={series}
                type="donut"
                width="400"
              />
            </Col>
            <Col xs={12} md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>
                    <strong>Directory:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex. C:\Users"
                    onChange={onChangeHandler}
                    onPaste={onChangeHandler}
                  />
                  <Form.Text className="text-muted">
                    Enter the directory you want to see status
                  </Form.Text>
                </Form.Group>
                <Button
                  type="submit"
                  className={styles.button}
                  onClick={obClickHandler}
                >
                  Submit
                </Button>
              </Form>

              <Chart
                options={barOptions}
                series={barSerise}
                type="bar"
                width="400"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={2}>
              <Card style={{ backgroundColor: "#fc7b03", color: "white", marginBottom:'9%' }}>
                <Card.Body>
                  <Card.Title>
                    <BsImageFill />
                    &nbsp; Image
                  </Card.Title>
                  <Card.Text>
                    Total file: {imagecount} <br />
                    Total size: {imagesize} MB
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={2}>
              <Card style={{ backgroundColor: "#06bd30", color: "white", marginBottom:'9%' }}>
                <Card.Body>
                  <Card.Title>
                    <BsCollectionPlayFill />
                    &nbsp; Video
                  </Card.Title>
                  <Card.Text>
                    Total file: {videocount} <br />
                    Total size: {videosize} MB
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={2}>
              <Card style={{ backgroundColor: "#fa2fc0", color: "white", marginBottom:'9%' }}>
                <Card.Body>
                  <Card.Title>
                    <MdPictureAsPdf />
                    &nbsp; Document
                  </Card.Title>
                  <Card.Text>
                    Total file: {doccount} <br />
                    Total size: {docsize} MB
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={2}>
              <Card style={{ backgroundColor: "#512ffa", color: "white", marginBottom:'9%' }}>
                <Card.Body>
                  <Card.Title>
                    <BsFillFileTextFill />
                    &nbsp; Text
                  </Card.Title>
                </Card.Body>
                <Card.Text>
                  Total file: {textcount} <br />
                  Total size: {textsize} MB
                </Card.Text>
              </Card>
            </Col>
            <Col xs={6} md={2}>
              <Card style={{ backgroundColor: "#adad0c", color: "white", marginBottom:'9%' }}>
                <Card.Body>
                  <Card.Title>
                    <SiMicrosoftexcel />
                    &nbsp; Excel
                  </Card.Title>
                </Card.Body>
                <Card.Text>
                  Total file: {excelcount} <br />
                  Total size: {excelsize} MB
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
