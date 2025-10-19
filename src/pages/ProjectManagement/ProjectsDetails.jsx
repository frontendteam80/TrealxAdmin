import React from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table from "../../components/Table.jsx";

export const projectData = [
  {
    CompanyName: "Ramky Estates & Farms Ltd",
    ProjectID: 139,
    ProjectName: "Ramky One Marvel",
    GeoLocation: "17.522111110935793, 78.4205508689747",
    Locality: "Kukatpally",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Ramky Estates & Farms Ltd",
    ProjectID: 140,
    ProjectName: "Ramky Selenium",
    GeoLocation: "17.421693000544438, 78.3329759040999",
    Locality: "Financial District",
    PropertyType: "Commercial",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Sumadhura Infracon Pvt. Ltd",
    ProjectID: 141,
    ProjectName: "Sumadhura Palais Royale",
    GeoLocation: "17.407053887265154, 78.35436791360531",
    Locality: "Financial District",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "NULL"
  },
  {
    CompanyName: "Sumadhura Infracon Pvt. Ltd",
    ProjectID: 142,
    ProjectName: "Sumadhura Gardens By The Brook",
    GeoLocation: "17.286651326813884, 78.41477722664318",
    Locality: "Shamshabad",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400001836"
  },
  {
    CompanyName: "Sumadhura Infracon Pvt. Ltd",
    ProjectID: 143,
    ProjectName: "Sumadhura The Olympus",
    GeoLocation: "17.427719629208303, 78.35073715190004",
    Locality: "Nanakramguda",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400003072"
  },
  {
    CompanyName: "Sumadhura Infracon Pvt. Ltd",
    ProjectID: 144,
    ProjectName: "Sumadhura Horizon",
    GeoLocation: "17.484720000000002, 78.386019609831",
    Locality: "Kondapur",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400001051"
  },
  {
    CompanyName: "Sumadhura Infracon Pvt. Ltd",
    ProjectID: 145,
    ProjectName: "Sumadhura Pragati Chambers",
    GeoLocation: "17.44077507351854, 78.4904260894576",
    Locality: "Sec-bad",
    PropertyType: "Commercial",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 146,
    ProjectName: "Auro The Regent",
    GeoLocation: "17.4815895878227, 78.3307146448015",
    Locality: "Kondapur",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02500003557"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 147,
    ProjectName: "Auro Kohinoor",
    GeoLocation: "17.474045896811, 78.3868485219681",
    Locality: "Hitech City",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400005068"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 148,
    ProjectName: "Auro The Pearl",
    GeoLocation: "17.474054807621134, 78.3868482503019",
    Locality: "Hitech City",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400005068"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 149,
    ProjectName: "Auro Sansa County",
    GeoLocation: "17.596258393262543, 78.2704783563047",
    Locality: "Patancheru",
    PropertyType: "Villas",
    ProjectStatus: "Under Construction",
    RERA: "NULL"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 150,
    ProjectName: "Auro Auraland",
    GeoLocation: "17.59376742604641, 78.2776663517578",
    Locality: "Patancheru",
    PropertyType: "Villas",
    ProjectStatus: "Under Construction",
    RERA: "P01100007349"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 151,
    ProjectName: "Auro Orbit",
    GeoLocation: "17.4349142566145, 78.37667976526369",
    Locality: "Hitech City",
    PropertyType: "Commercial",
    ProjectStatus: "Ready to Move",
    RERA: "NULL"
  },
  {
    CompanyName: "Auro Realty",
    ProjectID: 152,
    ProjectName: "Auro Galaxy",
    GeoLocation: "17.4366994433247, 78.37607234191928",
    Locality: "Hitech City",
    PropertyType: "Commercial",
    ProjectStatus: "Ready to Move",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 153,
    ProjectName: "DSR Altitude",
    GeoLocation: "17.438515469558222, 78.27471238414144",
    Locality: "Tellapur",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P01100009092"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 154,
    ProjectName: "DSR The Twins",
    GeoLocation: "17.404449651082703, 78.35247719595422",
    Locality: "Puppalaguda",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400005887"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 155,
    ProjectName: "DSR Sky Marq",
    GeoLocation: "17.44683294097213, 78.3978135942659",
    Locality: "Puppalaguda",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400004592"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 156,
    ProjectName: "DSR W",
    GeoLocation: "17.46149110284266, 78.33428600418635",
    Locality: "Kondapur",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02400002277"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 157,
    ProjectName: "DSR Fortune Sonthalia Skyvillas",
    GeoLocation: "17.386065272855773, 33.311125484068035",
    Locality: "Kokapet",
    PropertyType: "Villas",
    ProjectStatus: "Under Construction",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 158,
    ProjectName: "DSR Som Boulevard",
    GeoLocation: "17.45007198045039, 78.1592906711866",
    Locality: "Mokila Kondakankota",
    PropertyType: "Villas",
    ProjectStatus: "Under Construction",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 159,
    ProjectName: "DSR GVK Skycity",
    GeoLocation: "17.46211834060098, 78.339561608988",
    Locality: "Somajiguda",
    PropertyType: "Apartments",
    ProjectStatus: "Under Construction",
    RERA: "P02500000356"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 160,
    ProjectName: "DSR Reganti",
    GeoLocation: "17.44333819170037, 78.38311545436277",
    Locality: "Madhapur",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 161,
    ProjectName: "DSR The First",
    GeoLocation: "17.42690085646856, 78.37468456526356",
    Locality: "Gachibowli",
    PropertyType: "Apartments",
    ProjectStatus: "Ready to Move",
    RERA: "P02400000469"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 162,
    ProjectName: "DSR The Classe",
    GeoLocation: "17.3860256812315, 78.3347846978086",
    Locality: "Kokapet",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 163,
    ProjectName: "DSR The Classe Commercial",
    GeoLocation: "17.3860256812315, 78.3347846978086",
    Locality: "Kokapet",
    PropertyType: "Commercial",
    ProjectStatus: "Completed",
    RERA: "P02400001671"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 164,
    ProjectName: "DSR Tech Square",
    GeoLocation: "17.42787823831226, 78.37479138164844",
    Locality: "Gachibowli",
    PropertyType: "Commercial",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "DSR Builders & Developers",
    ProjectID: 165,
    ProjectName: "DSR One",
    GeoLocation: "17.42204378701998, 78.42830132846374",
    Locality: "Banjara Hills",
    PropertyType: "Commercial",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 166,
    ProjectName: "Niharika Skyline",
    GeoLocation: "17.41875305979693, 78.3743895373668",
    Locality: "Khajaguda",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "P02400001359"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 167,
    ProjectName: "Niharika Lakefront",
    GeoLocation: "17.48574906579391, 78.36531375238338",
    Locality: "Manikonda",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 168,
    ProjectName: "Niharika Landmark",
    GeoLocation: "17.42710816376776, 78.34139320659316",
    Locality: "Lingampally",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "P02400001732"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 169,
    ProjectName: "Niharika Interlake",
    GeoLocation: "17.41943215291296, 78.37502681048696",
    Locality: "Khajaguda",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 170,
    ProjectName: "Niharika Jubilee One",
    GeoLocation: "17.43240603898651, 78.36881283333333",
    Locality: "Jubilee Hills",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 171,
    ProjectName: "Niharika Signature",
    GeoLocation: "17.43794938855307, 78.37038946170087",
    Locality: "Gachibowli",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 172,
    ProjectName: "Niharika Exotica",
    GeoLocation: "17.42690085646856, 78.3746846978086",
    Locality: "Hitech City",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  },
  {
    CompanyName: "Niharika Projects",
    ProjectID: 173,
    ProjectName: "Niharika Hill Ridge",
    GeoLocation: "17.42507585972412, 78.4048793060092",
    Locality: "Nandagiri Hills",
    PropertyType: "Apartments",
    ProjectStatus: "Completed",
    RERA: "NULL"
  }
];
const projectColumns = [
    {label:"S.No",
      key:"serialNo",
      render: (_, __, index) => index + 1,
    },
  { key: "CompanyName", label: "Company Name" },
  { key: "ProjectID", label: "Project ID" },
  { key: "ProjectName", label: "Project Name" },
  { key: "GeoLocation", label: "Geo Location" },
  { key: "Locality", label: "Locality" },
  { key: "PropertyType", label: "Property Type" },
  { key: "ProjectStatus", label: "Project Status" },
  { key: "RERA", label: "RERA Number" }
];
function ProjectsDetails() {
  return (
    <div className="dashboard-container">
        <Sidebar/>
        <div
        className="buyers-content"
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          // maxWidth: "calc(100vw - 260px)",
          overflowX: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>ProjectDetails</h2>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#d4af37",
            }}
          >
            Kiran Reddy Pallaki
          </div>
          </div>
    <div>
      <Table
        
        columns={projectColumns}
        data={projectData}
        rowsPerPage={18}
      />
    </div>
    </div>
    </div>
  );
}

export default ProjectsDetails;
