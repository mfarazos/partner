const cors = require("cors");
const {  createUser,loginUser, getCensusData, fetchGoogleCompanies, Createproposal, getProposal,getdata ,getinterestdata } = require("../partnercontrollers/proposalController");

const CustomRoutes = (http, express) => {
   http.get("/partnerApp", (req, res) => {
     res.send("partner app");
   });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
// user Routes
http.post("/partnerApp/loginUser", loginUser);
http.post("/partnerApp/Createproposal", Createproposal);
http.post("/partnerApp/createUser", createUser);
http.get("/partnerApp/fetchGoogleCompanies", fetchGoogleCompanies);
http.get("/partnerApp/getdata", getdata);
http.post("/partnerApp/getCensusData", getCensusData);
http.get("/partnerApp/getinterestdata", getinterestdata);
http.get("/partnerApp/getProposal", getProposal);
}
  


module.exports = CustomRoutes;