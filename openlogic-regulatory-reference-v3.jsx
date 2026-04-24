import { useState } from "react";

const REGULATIONS = [
  {
    id: "ce",
    name: "UK Cyber Essentials",
    region: "UK",
    status: "Live (Apr 27, 2026)",
    summary: "EOL open source in scope = automatic certification failure. 14-day patching mandate with documented evidence.",
    timeline: "v3.3 (Danzell) effective now.\nApplies to all new assessments\ncreated after Apr 27, 2026.",
    scope: "Any UK organization seeking certification. Required for government contracts involving sensitive data. Increasingly required by financial services and defense supply chains.",
    requirements: "All in-scope software must be vendor-supported (A6.3, auto-fail). Critical/high-risk patches applied within 14 days (A6.4/A6.5, auto-fail). MFA mandatory on all cloud services. Documented, auditable evidence required.",
    ossImplication: "Any EOL open source component in scope triggers automatic certification failure: CentOS 7, AngularJS, PHP 7.x, Spring Framework 5.x, legacy Node.js. Community projects may not release patches within the 14-day window. Organizations must prove when patches were applied with timestamps, not assertions.",
    openlogicHelp: "LTS builds keep EOL packages in a vendor-supported lifecycle, satisfying A6.3 without requiring immediate migration. SLA-backed support provides a defined patch source and timestamped ticket history that serves as auditable evidence for the 14-day window.",
    urgency: "live",
    example: "Organization running CentOS 7 on production servers fails A6.3 automatically. With OpenLogic LTS, the component has an active vendor issuing CVE patches.",
  },
  {
    id: "cra",
    name: "EU Cyber Resilience Act (CRA)",
    region: "EU",
    status: "Reporting: Sep 2026",
    summary: "Products shipped with EOL open source into the EU create direct legal liability. 24-hour vulnerability reporting starts September.",
    timeline: "Reporting obligations:\nSep 11, 2026.\nFull product conformity:\nDec 11, 2027.",
    scope: "Manufacturers of products with digital elements sold into the EU market. Includes commercialized open source embedded in enterprise or OEM offerings.",
    requirements: "Report actively exploited vulnerabilities to ENISA within 24 hours. Maintain documented lifecycle security. Provide SBOMs. Security-by-design throughout product lifecycle.",
    ossImplication: "Every open source component in a shipped product must have active security response. An EOL component with no upstream patches means the manufacturer cannot meet the 24-hour reporting obligation because no one is producing fixes. Example: a vendor shipping Spring Framework 5.x (EOL) into the EU market has no remediation path without extended support.",
    openlogicHelp: "LTS builds extend the maintained lifecycle of EOL components with continued CVE patching. This closes the gap where community support has ended but the product is still in market, directly supporting the CRA's lifecycle maintenance requirement.",
    urgency: "deadline",
    caveat: "Penalty figures (up to 15M euros / 2.5% turnover) should be validated with legal before customer-facing use.",
  },
  {
    id: "dora",
    name: "DORA",
    region: "EU",
    status: "In force (Jan 2025)",
    summary: "Financial entities must document ICT vendor relationships with SLAs. Unsupported open source = undocumented ICT risk.",
    timeline: "Applicable now.\nCritical third-party provider\ndesignations ongoing through 2026.",
    scope: "Banks, insurers, investment firms, payment providers, crypto-asset service providers, and their critical ICT third-party providers.",
    requirements: "ICT risk management framework. Resilience testing. Incident reporting. Third-party risk management with documented contracts, SLAs, and tested exit strategies.",
    ossImplication: "Open source components running without a vendor support agreement represent undocumented ICT risk under DORA. The 2026 State of Open Source Report found 31% of Enterprise Java teams in financial services spend 75-90% of their time on maintenance, signaling operational fragility in exactly the systems DORA targets.",
    openlogicHelp: "OpenLogic provides a contracted vendor relationship with defined SLAs for open source infrastructure, satisfying DORA's third-party risk documentation requirements. The technology-agnostic model means exit strategy documentation is straightforward: no proprietary licensing to unwind.",
    urgency: "live",
    example: "Bank running Kafka and PostgreSQL in production without a support contract. DORA requires documented ICT third-party relationships. OpenLogic provides the contracted support.",
  },
  {
    id: "nis2",
    name: "NIS2 Directive",
    region: "EU",
    status: "Transposition in progress",
    summary: "Supply chain audit requirements extend to the full open source footprint. One vendor covering the entire estate simplifies documentation.",
    timeline: "Transposition deadline was Oct 2024.\nMost member states still finalizing.\nAudits expected mid-2026 onward.",
    scope: "Essential and important entities across 18 sectors: energy, transport, health, digital infrastructure, managed service providers, public administration. Size-cap rule applies.",
    requirements: "Risk management measures. Supply chain security and documentation. Incident reporting (24hr early warning, 72hr notification). Management accountability.",
    ossImplication: "Organizations must document what open source they run, who maintains it, and how vulnerabilities are managed across every component. The 2026 State of Open Source Report found 37% cite lack of skilled personnel as their top OSS challenge, directly affecting the ability to meet NIS2's risk management requirements.",
    openlogicHelp: "Full-stack support across 400+ packages provides a single documented vendor for the entire OSS estate. One support contract covers OS, middleware, databases, streaming, containers, and observability rather than requiring separate vendor relationships per component.",
    urgency: "deadline",
    example: "Healthcare provider running 12 different open source components. NIS2 requires supply chain documentation for each. OpenLogic covers all 12 under one contract.",
  },
  {
    id: "data-act",
    name: "EU Data Act",
    region: "EU",
    status: "Applied (Sep 2025)",
    summary: "Switching fees eliminated by Jan 2027. Financial barriers to migrating from proprietary platforms to open source are disappearing.",
    timeline: "General application: Sep 12, 2025.\nSwitching fee elimination:\nJan 11, 2027.",
    scope: "Cloud service providers, data processing services, IoT manufacturers, organizations using connected products or cloud-based data processing.",
    requirements: "Data portability rights. Cloud switching provisions. Elimination of switching fees by January 2027. Interoperability requirements.",
    ossImplication: "The elimination of switching fees removes a financial barrier that has historically slowed migration from proprietary platforms to open source. Organizations locked into Confluent, Cloudera, or commercial Linux contracts gain leverage to exit as of January 2027.",
    openlogicHelp: "Migration services from proprietary platforms to open source equivalents (Confluent to Kafka, Cloudera to Hadoop/Spark, commercial Linux to AlmaLinux/Rocky). The Data Act creates a window where OpenLogic's migration capability aligns with newly available buyer leverage.",
    urgency: "deadline",
    example: "Organization locked into Confluent with high switching fees. After January 2027, those fees are gone. OpenLogic provides the migration path to open source Kafka.",
  },
  {
    id: "csr",
    name: "UK CS&R Bill",
    region: "UK",
    status: "In Parliament",
    summary: "Managed service providers and critical suppliers brought into scope. Security measures across open source infrastructure will need documentation.",
    timeline: "Royal Assent expected 2026.\nCodes of practice TBD.\nFull implementation possibly 2028.",
    scope: "Critical national infrastructure, essential services, managed service providers, data centres (1MW+ IT load), designated critical suppliers.",
    requirements: "Enhanced security and resilience measures (details in secondary legislation). Expanded incident reporting. Supply chain documentation. [Requirements not yet finalized.]",
    ossImplication: "MSPs and critical suppliers are explicitly in scope. Organizations providing services on open source infrastructure will need to demonstrate documented security measures across that stack. Direction aligns with NIS2 principles; specifics depend on secondary legislation.",
    openlogicHelp: "OpenLogic's support model aligns with the Bill's stated objectives around documented third-party service relationships. Specific compliance mapping should wait until requirements are finalized through secondary legislation and codes of practice.",
    urgency: "upcoming",
    example: "Managed service provider running open source infrastructure for financial services clients. The Bill brings MSPs into scope. OpenLogic provides the vendor support layer.",
  },
  {
    id: "gdpr",
    name: "GDPR / Data Residency",
    region: "EU/UK",
    status: "In force (2018)",
    summary: "Data residency constraints favor open source deployed on sovereign infrastructure. 63% of EU/UK orgs cite vendor lock-in avoidance as a top OSS driver.",
    timeline: "Ongoing enforcement.\nSchrems II constraints active.\nNo current US adequacy decision.",
    scope: "Any organization processing personal data of EU/UK residents.",
    requirements: "Data minimization. Processing location controls. Adequacy decisions or SCCs for cross-border transfers. Breach notification within 72 hours.",
    ossImplication: "Proprietary platforms processing data through US infrastructure create transfer compliance risk under Schrems II. Open source alternatives deployed on EU-sovereign infrastructure give organizations direct control over data residency. The 2026 State of Open Source Report found 63% of EU/UK organizations cite avoiding vendor lock-in as a top OSS driver, with respondents volunteering 'data privacy confidence' unprompted.",
    openlogicHelp: "Technology-agnostic guidance for selecting and deploying open source on EU-based or on-premises infrastructure where the organization controls data residency. Migration services support transitions from US-hosted proprietary platforms to self-hosted open source alternatives.",
    urgency: "ongoing",
    example: "EU organization using a US-based SaaS analytics platform for customer data. Migrating to self-hosted open source on EU infrastructure eliminates the cross-border transfer issue.",
  },
];

const URGENCY_CONFIG = {
  live: { label: "In effect now", bg: "rgba(220,38,38,0.07)", border: "rgba(220,38,38,0.2)", text: "#991b1b", dot: "#dc2626" },
  deadline: { label: "Deadline approaching", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.2)", text: "#92400e", dot: "#d97706" },
  upcoming: { label: "On the horizon", bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.2)", text: "#1e40af", dot: "#2563eb" },
  ongoing: { label: "Ongoing enforcement", bg: "rgba(100,100,100,0.07)", border: "rgba(100,100,100,0.2)", text: "#525252", dot: "#737373" },
};

const REGION_FILTERS = ["All", "EU", "UK", "EU/UK"];

export default function RegulatoryGrid() {
  const [expandedId, setExpandedId] = useState(null);
  const [regionFilter, setRegionFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = REGULATIONS.filter(
    (r) => regionFilter === "All" || r.region === regionFilter
  );

  const toggleCard = (id) => {
    if (showAll) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const isCardExpanded = (id) => showAll || expandedId === id;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAF8",
        fontFamily: "'Newsreader', 'Georgia', serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: "#1a1a1a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>OL</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              OpenLogic by Perforce
            </span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 8px 0", letterSpacing: "-0.01em" }}>
            Open Source Compliance
            <br />
            <span style={{ fontWeight: 600 }}>Regulatory Reference</span>
          </h1>

          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, margin: "12px 0 0 0", maxWidth: 620, fontFamily: "'DM Sans', sans-serif" }}>
            Seven regulations across EU and UK. Each card answers: what does this require, what does it mean for your open source stack, and how does OpenLogic help? Sorted by urgency.
          </p>

          <p style={{ fontSize: 12, color: "#aaa", margin: "8px 0 0 0", fontFamily: "'DM Sans', sans-serif" }}>
            Data from the 2026 State of Open Source Report (712 organizations, with OSI and Eclipse Foundation). Updated April 2026.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {REGION_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                style={{
                  padding: "6px 16px", borderRadius: 20,
                  border: regionFilter === r ? "1.5px solid #1a1a1a" : "1.5px solid #ddd",
                  background: regionFilter === r ? "#1a1a1a" : "transparent",
                  color: regionFilter === r ? "#fff" : "#666",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowAll(!showAll); setExpandedId(null); }}
            style={{
              padding: "6px 14px", borderRadius: 6,
              border: "1.5px solid #ddd", background: showAll ? "#f5f5f3" : "transparent",
              color: "#888", fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
          >
            {showAll ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((reg) => {
            const expanded = isCardExpanded(reg.id);
            const uc = URGENCY_CONFIG[reg.urgency];

            return (
              <div
                key={reg.id}
                onClick={() => toggleCard(reg.id)}
                style={{
                  background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10,
                  cursor: showAll ? "default" : "pointer", transition: "all 0.25s ease",
                  boxShadow: expanded ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {/* Header */}
                <div style={{ padding: "18px 22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                      <h2 style={{ fontSize: 17, fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{reg.name}</h2>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: uc.text, background: uc.bg,
                        border: `1px solid ${uc.border}`, padding: "2px 8px", borderRadius: 4,
                        fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center",
                        gap: 4, whiteSpace: "nowrap",
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: uc.dot, display: "inline-block" }} />
                        {uc.label}
                      </span>
                      <span style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace" }}>{reg.region}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#777", margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                      {reg.summary}
                    </p>
                  </div>
                  {!showAll && (
                    <div style={{
                      fontSize: 18, color: "#bbb",
                      transform: expanded ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.25s ease", marginTop: 2, userSelect: "none", flexShrink: 0,
                    }}>
                      {"\u25BE"}
                    </div>
                  )}
                </div>

                {/* Expanded */}
                {expanded && (
                  <div style={{ padding: "0 22px 22px", borderTop: "1px solid #f0f0ec" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 16 }}>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                          Key Dates
                        </div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.55, margin: 0, fontFamily: "'DM Mono', monospace", whiteSpace: "pre-line" }}>
                          {reg.timeline}
                        </p>
                      </div>

                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                          Who It Applies To
                        </div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.55, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                          {reg.scope}
                        </p>
                      </div>

                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                          Core Requirements
                        </div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.55, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                          {reg.requirements}
                        </p>
                      </div>

                      <div style={{ padding: "10px 12px", background: "rgba(217,119,6,0.04)", borderRadius: 6, border: "1px solid rgba(217,119,6,0.12)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                          What This Means for Open Source
                        </div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.55, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                          {reg.ossImplication}
                        </p>
                      </div>
                    </div>

                    {/* OpenLogic + Example combined */}
                    <div style={{ marginTop: 14, padding: "14px 16px", background: "#f7f7f5", borderRadius: 8, border: "1px solid #e8e8e4" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                        How OpenLogic Helps
                      </div>
                      <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.55, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                        {reg.openlogicHelp}
                      </p>
                      {reg.example && (
                        <p style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5, margin: "10px 0 0 0", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", paddingTop: 10, borderTop: "1px solid #e8e8e4" }}>
                          Example: {reg.example}
                        </p>
                      )}
                      {reg.caveat && (
                        <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.4, margin: "8px 0 0 0", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
                          Note: {reg.caveat}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 40, padding: "16px 20px", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>Status</span>
          {Object.entries(URGENCY_CONFIG).map(([key, config]) => (
            <span key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666", fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: config.dot, display: "inline-block" }} />
              {config.label}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #e8e8e4", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", maxWidth: 520 }}>
              This reference is a practical positioning guide. Regulatory interpretations, penalty figures, and compliance claims should be validated with legal counsel before customer-facing use. Where requirements are not yet finalized (UK CS&R Bill, NIS2 national transpositions), OpenLogic's relevance is stated directionally. OpenLogic supports 400+ open source packages.
            </p>
            <p style={{ fontSize: 11, color: "#ccc", margin: "8px 0 0 0", fontFamily: "'DM Mono', monospace" }}>
              openlogic.com/supported-technology
            </p>
          </div>
          <p style={{ fontSize: 11, color: "#ccc", margin: 0, fontFamily: "'DM Mono', monospace" }}>v3.0 / April 2026</p>
        </div>
      </div>
    </div>
  );
}
