import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Tooltip,
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const FIPS_TO_CODE = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  11: "DC",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
};

const colorScale = scaleQuantize()
  .domain([0, 500000])
  .range([
    "#EFF6FF",
    "#DBEAFE",
    "#BFDBFE",
    "#93C5FD",
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
    "#1E3A8A",
  ]);

export default function RiskMap() {
  const [filingsData, setFilingsData] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filingsRes, riskRes] = await Promise.all([
          apiClient.get("/sar/filings-by-state"),
          apiClient.get("/risk/risk-scores"),
        ]);
        setFilingsData(filingsRes.data);
        setRiskScores(riskRes.data);
      } catch (err) {
        console.error("Error fetching map data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filingsByCode = Object.fromEntries(
    filingsData.map((d) => [d.state_code, d]),
  );
  const riskByCode = Object.fromEntries(
    riskScores.map((d) => [d.state_code, d]),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-3">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-base font-semibold text-slate-900">
            SAR Filing Risk Map — United States
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Choropleth map of SAR filing volume by state · FinCEN public data
            2020–2024
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
          {/* Map */}
          <div className="p-4">
            <ComposableMap projection="geoAlbersUsa" className="w-full">
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = geo.id;
                    const code = FIPS_TO_CODE[fips];
                    const filing = filingsByCode[code];
                    const risk = riskByCode[code];
                    const count = filing?.total_filings || 0;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={colorScale(count)}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            fill: "#F59E0B",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => {
                          setTooltipContent(
                            `${geo.properties.name} · ${count.toLocaleString()} filings${
                              risk
                                ? ` · Risk score: ${risk.risk_score?.toFixed(0)}`
                                : ""
                            }`,
                          );
                        }}
                        onMouseLeave={() => setTooltipContent("")}
                        onClick={() => {
                          if (risk) setSelectedState(risk);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipContent && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                {tooltipContent}
              </div>
            )}

            {/* Legend */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-slate-400">Lower filings</span>
              {[
                "#EFF6FF",
                "#BFDBFE",
                "#93C5FD",
                "#60A5FA",
                "#3B82F6",
                "#2563EB",
                "#1E3A8A",
              ].map((c) => (
                <span
                  key={c}
                  className="inline-block h-4 w-6 rounded"
                  style={{ background: c }}
                />
              ))}
              <span className="text-xs text-slate-400">Higher filings</span>
            </div>
          </div>

          {/* Side panel — top states */}
          <div className="border-l border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                Top states by filing volume
              </p>
              <p className="text-xs text-slate-400">
                Click a state to drilldown
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {filingsData
                .filter((d) => d.state_code && d.state_code.length === 2)
                .sort((a, b) => b.total_filings - a.total_filings)
                .slice(0, 12)
                .map((d, i) => {
                  const risk = riskByCode[d.state_code];
                  return (
                    <button
                      key={d.state_code}
                      onClick={() => risk && setSelectedState(risk)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                    >
                      <span className="w-5 text-xs text-slate-400">
                        {i + 1}
                      </span>
                      <span className="w-8 text-sm font-semibold text-slate-900">
                        {d.state_code}
                      </span>
                      <div className="flex-1">
                        <div className="h-1.5 rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (d.total_filings /
                                  (filingsData[0]?.total_filings || 1)) *
                                  100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {(d.total_filings / 1000).toFixed(0)}k
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <StateDrilldownDrawer
        state={selectedState}
        states={riskScores}
        onClose={() => setSelectedState(null)}
      />
    </div>
  );
}
