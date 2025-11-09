 // src/pages/Sellers/Sellers.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";

import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";

import { useApi } from "../../API/Api.js";

/* small cell that toggles long address */
function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return <>N/A</>;
  const locations = value.split(",").map((item) => item.trim());
  const firstLocation = locations[0];
  const hasMore = locations.length > 1;
  return (
    <span
  if (!value || typeof value !== "string") return <>-</>;
  const locations = value.split(",").map((s) => s.trim()).filter(Boolean);
  const first = locations[0] ?? "-";
  const hasMore = locations.length > 1;
  return (
    <span
      title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
      onClick={() => hasMore && setShowAll((v) => !v)}
      style={{ cursor: hasMore ? "pointer" : "default", color: "#111" }}
    >
      style={{
        cursor: hasMore ? "pointer" : "default",
        color: "black",
      }}
      onClick={() => hasMore && setShowAll(!showAll)}
      title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
    >
      {showAll ? locations.join(", ") : (
        <>
          {firstLocation}
          {hasMore ? ",..." : ""}
        </>
      )}

      {showAll ? locations.join(", ") : (first + (hasMore ? ",..." : ""))}

    </span>
  );
}

function Spinner({ size = 36 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          width: size,
          height: size,
          border: `${Math.max(3, Math.round(size / 12))}px solid #e5e7eb`,
          borderTop: `${Math.max(3, Math.round(size / 12))}px solid #111827`,
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Sellers() {
  const { fetchData } = useApi();
  const [sellers, setSellers] = useState([]);
export default function Sellers() {
  const { fetchData } = useApi();

  const [sellers, setSellers] = useState([]); // full dataset
  const [filtered, setFiltered] = useState([]); // after filter + search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // table pagination & search/filter UI state
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [searchQuery, setSearchQuery] = useState("");

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;


  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const arr = Array.isArray(data) ? data : data?.data || [];
        if (!mounted) return;
        setSellers(arr);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Error loading sellers");
      } finally {
        if (!mounted) return;
        setLoading(false);

        const res = await fetchData("SellersDetails");
        const arr = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
        // do not put serialNo here — Table will compute using page + rowsPerPage.
        if (!mounted) return;
        setSellers(arr);
        setFiltered(arr);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load sellers");
        setSellers([]);
        setFiltered([]);
      } finally {
        if (mounted) setLoading(false);

      }
    }
    load();
    return () => { mounted = false; };
  }, [fetchData]);

  // --- helper: toggle filter dropdown ---
  const toggleFilter = (key) => {
    setOpenFilter((p) => (p === key ? null : key));
    setFilterSearchValue("");
  };

  // --- filter checkbox handler (maintains arrays of selected values) ---
  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = Array.isArray(prev[key]) ? [...prev[key]] : [];
      return prevVals.includes(value)
        ? { ...prev, [key]: prevVals.filter((v) => v !== value) }
        : { ...prev, [key]: [...prevVals, value] };
    });
  };

  // --- clear a single column filter ---
  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  // --- apply filters to full dataset (called when user clicks Apply in dropdown) ---
  const applyFilter = () => {
    // combine filters + existing search
    let out = [...sellers];

    Object.entries(filters).forEach(([k, vals]) => {
      if (!Array.isArray(vals) || vals.length === 0) return;
      // Special handling for ResidentialAddress (contains comma-separated values)
      if (k === "ResidentialAddress") {
        out = out.filter((row) => {
          const raw = row[k] || "";
          const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
          return vals.some((v) => parts.includes(v));
        });
      } else if (k === "IslegalOwner") {
        // in dataset this might be boolean or "Y"/"N" etc.
        out = out.filter((row) => {
          const val = row[k];
          const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
          return vals.includes(normalized);
        });
      } else {
        out = out.filter((row) => vals.includes(row[k]));
      }
    });

    // also apply global search if any
    if (searchQuery && String(searchQuery).trim()) {
      const lower = searchQuery.toLowerCase();
      out = out.filter((row) =>
        Object.values(row).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(lower)
        )
      );
    }

    setFiltered(out);
    setOpenFilter(null);
    setPage(1);
  };

  // unique values helper required by Table: returns array for given column key (from full dataset)
  const uniqueValues = (key) => {
    if (!sellers || sellers.length === 0) return [];
    if (key === "ResidentialAddress") {
      const all = sellers.flatMap((r) => (r.ResidentialAddress ? String(r.ResidentialAddress).split(",").map(s => s.trim()) : []));
      return Array.from(new Set(all.filter(Boolean)));
    }
    if (key === "IslegalOwner") {
      // return yes/no representation
      return ["yes", "no"];
    }
    const list = sellers.map((r) => r[key]).filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
    return Array.from(new Set(list));
  };

  // --- global search effect (applies to sellers + current filters) ---
  useEffect(() => {
    const lower = String(searchQuery || "").trim().toLowerCase();
    if (!lower) {
      // re-apply filters only
      let out = [...sellers];
      Object.entries(filters).forEach(([k, vals]) => {
        if (!Array.isArray(vals) || vals.length === 0) return;
        if (k === "ResidentialAddress") {
          out = out.filter((row) => {
            const parts = row[k] ? String(row[k]).split(",").map(s => s.trim()) : [];
            return vals.some((v) => parts.includes(v));
          });
        } else if (k === "IslegalOwner") {
          out = out.filter((row) => {
            const val = row[k];
            const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
            return vals.includes(normalized);
          });
        } else {
          out = out.filter((row) => vals.includes(row[k]));
        }
      });
      setFiltered(out);
      setPage(1);
      return;
    }

    // filter by search across fields + filters
    let out = sellers.filter((row) =>
      Object.values(row).some(
        (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(lower)
      )
    );

    // then apply column filters on top
    Object.entries(filters).forEach(([k, vals]) => {
      if (!Array.isArray(vals) || vals.length === 0) return;
      if (k === "ResidentialAddress") {
        out = out.filter((row) => {
          const parts = row[k] ? String(row[k]).split(",").map(s => s.trim()) : [];
          return vals.some((v) => parts.includes(v));
        });
      } else if (k === "IslegalOwner") {
        out = out.filter((row) => {
          const val = row[k];
          const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
          return vals.includes(normalized);
        });
      } else {
        out = out.filter((row) => vals.includes(row[k]));
      }
    });

    setFiltered(out);
    setPage(1);
  }, [searchQuery, sellers, filters]);

  // paginated slice shown to Table
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return (filtered || []).slice(start, start + rowsPerPage);
  }, [filtered, page]);

  // columns for Table: Table will show filter icon for columns unless it thinks label is serial/action
  const columns = [
  // keep page within bounds when data length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(sellers.length / rowsPerPage));
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [sellers.length, page]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sellers.slice(start, start + rowsPerPage);
  }, [sellers, page]);

  const columns = useMemo(() => [
    {
      label: "S.No",
      key: "serialNo",
      // compute serial with current page offset
      render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,
      canFilter: false,
    },
    { label: "Seller Id", key: "Sellerid" },
    { label: "Seller Name", key: "SellerName" },
    {
      label: "Residential Address",
      key: "ResidentialAddress",
      render: (val) => <LocationCell value={val} />,
    },
    {
      label: (
        <HeaderWithFilter
          label="Seller Id"
          columnKey="Sellerid"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "Sellerid",
    },
    {
      label: (
        <HeaderWithFilter
          label="Seller Name"
          columnKey="SellerName"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "SellerName",
    },
    {
      label: (
        <HeaderWithFilter
          label="Residential Address"
          columnKey="ResidentialAddress"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "ResidentialAddress",
      render: val => <LocationCell value={val} />,
    },
    {
      label: (
        <HeaderWithFilter
          label="Owner"
          columnKey="IslegalOwner"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "IslegalOwner",
      render: val => (val ? "yes" : "no"),
    },
    {
      label: (
        <HeaderWithFilter
          label="Contact Number"
          columnKey="ContactNumber"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "ContactNumber",
    },
    {
      label: (
        <HeaderWithFilter
          label="Email"
          columnKey="Email"
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filterSearchValue={filterSearchValue}
          setFilterSearchValue={setFilterSearchValue}
          uniqueValues={uniqueValues}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
        />
      ),
      key: "Email",
    },
    { label: "Contact Number", key: "ContactNumber" },
    { label: "Email", key: "Email" },
  ], [page]);

  const totalPages = Math.ceil(sellers.length / rowsPerPage);

  if (error) return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;

    { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1, canFilter: false },
    { label: "Seller Id", key: "Sellerid" },
    { label: "Seller Name", key: "SellerName" },
    { label: "Residential Address", key: "ResidentialAddress", render: (v) => <LocationCell value={v} /> },
    { label: "Owner", key: "IslegalOwner", render: (v) => (v ? "yes" : "no") },
    { label: "Contact Number", key: "ContactNumber" },
    { label: "Email", key: "Email" },
  ];

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;


  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", padding: 24, marginLeft: "180px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Sellers</h2>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 16 }}>
          <div style={{ minWidth: 260 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
          </div>

          {/* <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* small summary */}
            {/* <div style={{ color: "#6b7280" }}>{filtered.length.toLocaleString()} records</div>
          </div> */} 
        </div>

        <Table
          columns={columns}
          paginatedData={paginatedData}
          page={page}
          rowsPerPage={rowsPerPage}
          filters={filters}
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          handleCheckboxChange={handleCheckboxChange}
          uniqueValues={uniqueValues}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
          // choose a stable row key if available
          rowKey={(row, idx) => row?.Sellerid ?? `seller-${(page - 1) * rowsPerPage + idx}`}
          onRowClick={() => {}}
        />

      <div
        className="buyers-content"
        style={{
          flex: 1,
          minHeight: "100vh",
          overflowX: "auto",
          padding: 24,
          marginLeft: "180px",
          boxSizing: "border-box",
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
           <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          Sellers
        </h2>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#d4af37",
            }}
          >
            Previous
          </button>
          <span>Page {page} of {Math.ceil(filteredSellers.length / rowsPerPage)}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, Math.ceil(filteredSellers.length / rowsPerPage)))}
            disabled={page === Math.ceil(filteredSellers.length / rowsPerPage)}
            style={{ padding: "6px 12px", cursor: page === Math.ceil(filteredSellers.length / rowsPerPage) ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>

        <div style={{ borderRadius: 8, background: "#fff", padding: 6 }}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Table
                columns={columns}
                paginatedData={paginatedData}
                rowsPerPage={rowsPerPage}
              />

              {totalPages > 1 && (
                <div style={{ marginTop: 8 }}>
                  <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
              )}
            </>
          )}
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil((filtered || []).length / rowsPerPage))}
        />

      </div>
    </div>
  );
}
  