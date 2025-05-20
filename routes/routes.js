const cors = require("cors");
const { updateTestApi, getTestApi, testApi,createUser,loginUser, getCensusData, cloneProposal, archiveProposal, fetchGoogleCompanies, getproposalbyId, getcity, getcitydetail, getcityzipcode, Createproposal, getProposal,getdata ,getinterestdata,fetchYelpBusiness, resetPassword,  forgotPassword, getdemography, getspecificdemography, testApiupdate  } = require("../partnercontrollers/proposalController");

const CustomRoutes = (http, express) => {
   http.get("/partnerApp", (req, res) => {
     res.send("partner app");
   });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
// user Routes
http.post("/partnerApp/testApi", testApi);
http.get("/partnerApp/getTestApi", getTestApi);
http.get("/partnerApp/updateTestApi", updateTestApi);




http.post("/partnerApp/loginUser", loginUser);
http.post("/partnerApp/Createproposal", Createproposal);
http.post("/partnerApp/cloneProposal", cloneProposal);
http.post("/partnerApp/archiveProposal", archiveProposal);


http.post("/partnerApp/createUser", createUser);
http.get("/partnerApp/getcity", getcity);
http.get("/partnerApp/getcitydetail", getcitydetail);
http.get("/partnerApp/getcityzipcode", getcityzipcode );

http.post("/partnerApp/getdemography", getdemography);
http.get("/partnerApp/getspecificdemography", getspecificdemography);

http.get("/partnerApp/fetchGoogleCompanies", fetchGoogleCompanies);
http.get("/partnerApp/fetchYelpBusiness", fetchYelpBusiness);
http.get("/partnerApp/getdata", getdata);
http.post("/partnerApp/getCensusData", getCensusData);
http.put("/partnerApp/testApiupdate", testApiupdate);
http.get("/partnerApp/getinterestdata", getinterestdata);
http.get("/partnerApp/getProposal", getProposal);
http.post("/partnerApp/forgotPassword", forgotPassword);
http.post("/partnerApp/resetPassword", resetPassword);
http.get("/partnerApp/getproposalbyId/:id", getproposalbyId);

}
  


module.exports = CustomRoutes;