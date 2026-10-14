export const WORKBOOK_TASK_UPDATE = {
  "revision": "2026-10-14-v4-workbook-reviewed",
  "source": "ICVSP_Project_Plan_Gantt_and_Jira_v4(1).xlsx",
  "tasks": [
    {
      "id": "P1",
      "name": "Project kickoff / initial research",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Project kickoff / initial research",
        "Lead": "All 6",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "Project began about one week before 6 Oct."
      },
      "start": "2026-09-29",
      "end": "2026-10-04",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P2",
      "name": "Proposal submission",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Proposal submission",
        "Lead": "Malak",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Proposal written by Malak; already submitted."
      },
      "start": "2026-09-29",
      "end": "2026-10-04",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "AI1",
      "name": "ESPDet-Pico ESP32-S3 simulation baseline",
      "status": "Completed",
      "values": {
        "Workstream": "AI & Data",
        "Task": "ESPDet-Pico ESP32-S3 simulation baseline",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "486 KB 8-bit model; speed-bump mAP50 0.72 in simulation; real-board validation pending."
      },
      "start": "2026-09-29",
      "end": "2026-10-04",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "E1",
      "name": "Firmware logic + PlatformIO unit-test baseline",
      "status": "Completed",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Firmware logic + PlatformIO unit-test baseline",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "Firmware logic already unit-tested on laptop."
      },
      "start": "2026-09-29",
      "end": "2026-10-04",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "E2",
      "name": "Trust / consensus engine simulation baseline",
      "status": "Completed",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Trust / consensus engine simulation baseline",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "Existing trust engine and simulation tests in the working repo."
      },
      "start": "2026-09-29",
      "end": "2026-10-04",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P3",
      "name": "Feasibility report",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Feasibility report",
        "Lead": "Moaz",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Done and submitted."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P4",
      "name": "Literature review",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Literature review",
        "Lead": "Rana",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Delivered: IEEE-style literature review paper (7 pages, 38 references)."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P5",
      "name": "Testing tools research",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Testing tools research",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Delivered: testing and verification tools PDF (one recommended tool per test level)."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P6",
      "name": "Read hardware + update security requirements",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Read hardware + update security requirements",
        "Lead": "Malak",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Update security requirements to reflect selected/candidate hardware."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P7",
      "name": "Update cybersecurity requirements for V-Cycle",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Update cybersecurity requirements for V-Cycle",
        "Lead": "Ahmed",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Delivered: cybersecurity requirements document v2.1."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P8",
      "name": "Gantt chart (named owners, weekly view, automatic colours) + clean Jira backlog",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Gantt chart (named owners, weekly view, automatic colours) + clean Jira backlog",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P1",
        "Notes": "Gantt rebuilt with named owners, weekly grouping and automatic colours."
      },
      "start": "2026-10-06",
      "end": "2026-10-13",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P10",
      "name": "Weekly mentor review / requirements feedback",
      "status": "In Progress",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Weekly mentor review / requirements feedback",
        "Lead": "All 6",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "",
        "Notes": "Recurring weekly review activity."
      },
      "start": "2026-10-06",
      "end": "2027-06-15",
      "progress": 5,
      "priority": "High"
    },
    {
      "id": "H1",
      "name": "Finalize first-prototype bill of materials",
      "status": "Completed",
      "values": {
        "Workstream": "Hardware",
        "Task": "Finalize first-prototype bill of materials",
        "Lead": "Malak",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P6",
        "Notes": "One prototype set only."
      },
      "start": "2026-10-06",
      "end": "2026-10-12",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "H2",
      "name": "Purchase first prototype hardware set",
      "status": "In Progress",
      "values": {
        "Workstream": "Hardware",
        "Task": "Purchase first prototype hardware set",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "H1",
        "Notes": "Arrival date unknown."
      },
      "start": "2026-10-06",
      "end": "2026-10-20",
      "progress": 30,
      "priority": "High"
    },
    {
      "id": "H3",
      "name": "Mentor verification of ESP32-S3 candidate",
      "status": "Completed",
      "values": {
        "Workstream": "Hardware",
        "Task": "Mentor verification of ESP32-S3 candidate",
        "Lead": "Malak",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "H1",
        "Notes": "Candidate still being verified by mentors."
      },
      "start": "2026-10-06",
      "end": "2026-10-20",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "AI2",
      "name": "Document emulator limitation and board-validation plan",
      "status": "Completed",
      "values": {
        "Workstream": "AI & Data",
        "Task": "Document emulator limitation and board-validation plan",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "AI1",
        "Notes": "Delivered: firmware results note + verification status document (QEMU runs, results not valid; board needed)."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "E6",
      "name": "Device decision logic: camera hazard tracker + camera/IMU fusion",
      "status": "Completed",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Device decision logic: camera hazard tracker + camera/IMU fusion",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "E1,AI1",
        "Notes": "Road check, 3-of-5 frames, motion check, IMU+camera fusion; 49 unit tests; accuracy with logic measured on held-out video."
      },
      "start": "2026-10-06",
      "end": "2026-10-09",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "C1",
      "name": "Finalize rewritten NFR-10 + security traceability",
      "status": "Completed",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "Finalize rewritten NFR-10 + security traceability",
        "Lead": "TBD",
        "Support (who helps, with what)": "Malak, Ahmed, Moaz (split not decided yet)",
        "Status": "Completed",
        "Depends on": "P6,P7",
        "Notes": "Sender identity, Ed25519 integrity, TLS where applicable, replay scope."
      },
      "start": "2026-10-06",
      "end": "2026-10-18",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "D5",
      "name": "Graduation project forms (project selection + proposal form)",
      "status": "Completed",
      "values": {
        "Workstream": "Documentation",
        "Task": "Graduation project forms (project selection + proposal form)",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "University forms filled for all six students."
      },
      "start": "2026-10-06",
      "end": "2026-10-08",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "D6",
      "name": "Verification status & detection results document (for mentors)",
      "status": "Completed",
      "values": {
        "Workstream": "Documentation",
        "Task": "Verification status & detection results document (for mentors)",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "AI1,E1",
        "Notes": "Status table (board / simulated board / computer tests / planned), per-class results, datasets, latency method."
      },
      "start": "2026-10-06",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "MS1",
      "name": "Team meeting with professor (Sunday)",
      "status": "Completed",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Team meeting with professor (Sunday)",
        "Lead": "All 6",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "",
        "Notes": "Whole-team meeting. Date to confirm (11 Oct assumed)."
      },
      "start": "2026-10-11",
      "end": "2026-10-11",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "P9",
      "name": "Consolidate updated requirements baseline",
      "status": "Planned",
      "values": {
        "Workstream": "Planning & Requirements",
        "Task": "Consolidate updated requirements baseline",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P3,P4,P5,P6,P7",
        "Notes": "Resolve rejected/restricted items and baseline the updated document."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "AI3",
      "name": "Collect / curate Egyptian road dataset",
      "status": "Planned",
      "values": {
        "Workstream": "AI & Data",
        "Task": "Collect / curate Egyptian road dataset",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P4",
        "Notes": "More own data, especially relevant road-hazard cases."
      },
      "start": "2026-10-12",
      "end": "2026-11-22",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "E7",
      "name": "Expand the simulation and core system logic (device → trust engine → warning)",
      "status": "In Progress",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Expand the simulation and core system logic (device → trust engine → warning)",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz (trust engine)",
        "Status": "In Progress",
        "Depends on": "E2,E6",
        "Notes": "Mentor MoM action item. Eng. Mahmoud El-Tantawy: continue expanding the simulation, adding core system logic. Progress: device and trust engine now share message format v2 (E8); end-to-end run device → engine → warning still to do. 13 Oct: whole-chain simulation (sil/) running: cars run the real device code, phones upload to the backend, 4 scenarios incl. faults and attacks."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 60,
      "priority": "High"
    },
    {
      "id": "M7",
      "name": "Mobile application & system design guide v1.0 (phase 1)",
      "status": "Completed",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Mobile application & system design guide v1.0 (phase 1)",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "A1",
        "Notes": "16-page design: architecture, BLE/GATT contract, driver journey, UI concept, warning logic, offline queue, backend, database, security, roadmap, validation matrix. First draft of M1 and M5."
      },
      "start": "2026-10-12",
      "end": "2026-10-13",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "M5",
      "name": "Define mobile app ↔ device (ECU) messaging protocol (BLE messages)",
      "status": "In Progress",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Define mobile app ↔ device (ECU) messaging protocol (BLE messages)",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "A1",
        "Notes": "Mentor MoM action item. GATT contract drafted in M7; message format agreed (E8). Still to do: UUIDs, MTU/chunking, acknowledgement."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 40,
      "priority": "High"
    },
    {
      "id": "M6",
      "name": "Integrate GPS features into the mobile app",
      "status": "In Progress",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Integrate GPS features into the mobile app",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "A1",
        "Notes": "Mentor MoM action item. Eng. Mahmoud El-Tantawy: mobile & telematics, GPS integration in the app. Started in M7 (GPS on the phone side of the design)."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 20,
      "priority": "High"
    },
    {
      "id": "C6",
      "name": "Cybersecurity tech-stack mapping: language, libraries and tools per security concept; verify ESP32-S3 hardware crypto (AES etc.); choose cloud technology",
      "status": "In Progress",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "Cybersecurity tech-stack mapping: language, libraries and tools per security concept; verify ESP32-S3 hardware crypto (AES etc.); choose cloud technology",
        "Lead": "Moaz",
        "Support (who helps, with what)": "Ahmed, Malak (cloud technology choice)",
        "Status": "In Progress",
        "Depends on": "P7,C1",
        "Notes": "Mentor MoM action item. Eng. Mahmoud Ali: for each security concept say how it is implemented (e.g. C), with which library/tool, and whether the controller supports it in hardware (AES, SHA, secure boot, flash encryption). Also decide the cloud technology."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 10,
      "priority": "High"
    },
    {
      "id": "T7",
      "name": "Trial-and-error tests across the stack options under failure conditions (stress-test components early)",
      "status": "In Progress",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Trial-and-error tests across the stack options under failure conditions (stress-test components early)",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "E7",
        "Notes": "Mentor MoM action item. Both mentors: hands-on trial-and-error testing across languages/components to catch failures early and check stability under failure (e.g. lost messages, BLE disconnect, no GPS, cloud offline). 13 Oct: fault and attack scenarios in the simulation (BLE loss, outage, GPS loss, Sybil, replay, tampering, revoked device)."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 40,
      "priority": "High"
    },
    {
      "id": "D7",
      "name": "Requirements HTML dashboard: simpler links so requirements, SRS items and test cases are easy to trace, search and navigate",
      "status": "In Progress",
      "values": {
        "Workstream": "Documentation",
        "Task": "Requirements HTML dashboard: simpler links so requirements, SRS items and test cases are easy to trace, search and navigate",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "P9",
        "Notes": "Mentor MoM action item. Eng. Mahmoud Ali: structure the view so each requirement links to its SRS item and test cases."
      },
      "start": "2026-10-12",
      "end": "2026-10-18",
      "progress": 10,
      "priority": "High"
    },
    {
      "id": "D1",
      "name": "Maintain requirements / traceability / test evidence",
      "status": "Planned",
      "values": {
        "Workstream": "Documentation",
        "Task": "Maintain requirements / traceability / test evidence",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P9",
        "Notes": "Living V-Cycle documentation."
      },
      "start": "2026-10-12",
      "end": "2027-06-15",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "H4",
      "name": "Procurement follow-up / delivery buffer",
      "status": "Waiting for hardware",
      "values": {
        "Workstream": "Hardware",
        "Task": "Procurement follow-up / delivery buffer",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Waiting for hardware",
        "Depends on": "H2",
        "Notes": "Schedule will move when vendor delivery date is known."
      },
      "start": "2026-10-13",
      "end": "2026-11-15",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "E8",
      "name": "Message format v2: merge device format with the mobile design (device code, trust engine, tests)",
      "status": "Completed",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Message format v2: merge device format with the mobile design (device code, trust engine, tests)",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Mariam (design input)",
        "Status": "Completed",
        "Depends on": "M7,E6",
        "Notes": "boot_id + sequence (IDs no longer repeat after reboot), gps_valid, imu_peak_g; 52 device + 46 engine tests pass; demo signing-key bug fixed; pushed to GitHub with the decision logic (E6)."
      },
      "start": "2026-10-13",
      "end": "2026-10-13",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "B1",
      "name": "Backend project skeleton + core API",
      "status": "In Progress",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Backend project skeleton + core API",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz",
        "Status": "In Progress",
        "Depends on": "A2",
        "Notes": "Started early. FastAPI prototype: device registry, POST /reports, POST /beacons, GET /hazards; SQLite now, Supabase later. 18 API tests."
      },
      "start": "2026-10-13",
      "end": "2026-11-22",
      "progress": 60,
      "priority": "High"
    },
    {
      "id": "B3",
      "name": "Hazard report API + validation + replay checks",
      "status": "In Progress",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Hazard report API + validation + replay checks",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz",
        "Status": "In Progress",
        "Depends on": "B1,B2",
        "Notes": "Signature with registered key, revoked/unknown devices, schema v2, replay and boot/sequence checks, idempotent retries, rejection log. Tested."
      },
      "start": "2026-10-13",
      "end": "2026-12-20",
      "progress": 60,
      "priority": "High"
    },
    {
      "id": "T8",
      "name": "Test strategy & verification status (V-cycle), traceability check in CI",
      "status": "Completed",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Test strategy & verification status (V-cycle), traceability check in CI",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "",
        "Status": "Completed",
        "Depends on": "P5",
        "Notes": "PDF for mentors; verification/traceability.csv linked to V-cycle v1.1 and security V-cycle IDs."
      },
      "start": "2026-10-13",
      "end": "2026-10-13",
      "progress": 100,
      "priority": "High"
    },
    {
      "id": "T1",
      "name": "Unit/integration/regression test automation",
      "status": "In Progress",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Unit/integration/regression test automation",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "In Progress",
        "Depends on": "C2",
        "Notes": "GitHub Actions on every push: 121 tests, integration check, requirement traceability report."
      },
      "start": "2026-10-13",
      "end": "2027-02-14",
      "progress": 30,
      "priority": "Medium"
    },
    {
      "id": "AI4",
      "name": "Train/evaluate additional lightweight model iteration",
      "status": "Planned",
      "values": {
        "Workstream": "AI & Data",
        "Task": "Train/evaluate additional lightweight model iteration",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "AI3",
        "Notes": "Additional model/data iteration; exact final model remains open."
      },
      "start": "2026-10-19",
      "end": "2026-11-30",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "A1",
      "name": "Decide mobile app stack",
      "status": "Planned",
      "values": {
        "Workstream": "Architecture Decisions",
        "Task": "Decide mobile app stack",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P9",
        "Notes": "Currently undecided."
      },
      "start": "2026-10-19",
      "end": "2026-10-25",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "A2",
      "name": "Decide backend technology / API architecture",
      "status": "Planned",
      "values": {
        "Workstream": "Architecture Decisions",
        "Task": "Decide backend technology / API architecture",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz; Ahmed, Malak (cloud side)",
        "Status": "Planned",
        "Depends on": "P9",
        "Notes": "Currently undecided."
      },
      "start": "2026-10-19",
      "end": "2026-11-01",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "A3",
      "name": "Decide main cooperative path: cloud and/or direct V2V",
      "status": "Planned",
      "values": {
        "Workstream": "Architecture Decisions",
        "Task": "Decide main cooperative path: cloud and/or direct V2V",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P9",
        "Notes": "Currently undecided; affects ESP-NOW/V2V scope."
      },
      "start": "2026-10-19",
      "end": "2026-11-01",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "A4",
      "name": "Choose identity provider and transport security profile",
      "status": "Planned",
      "values": {
        "Workstream": "Architecture Decisions",
        "Task": "Choose identity provider and transport security profile",
        "Lead": "Malak",
        "Support (who helps, with what)": "Ahmed",
        "Status": "Planned",
        "Depends on": "P9",
        "Notes": "Cognito vs Firebase and TLS/mTLS alignment still open."
      },
      "start": "2026-10-19",
      "end": "2026-11-01",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "C2",
      "name": "DevSecOps CI: unit tests + Gitleaks/Semgrep/security checks",
      "status": "Planned",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "DevSecOps CI: unit tests + Gitleaks/Semgrep/security checks",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "P5",
        "Notes": "Automate reproducible pass/fail evidence."
      },
      "start": "2026-10-19",
      "end": "2026-11-08",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "M1",
      "name": "Mobile UX / warning-flow design",
      "status": "Planned",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Mobile UX / warning-flow design",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "A1",
        "Notes": "First draft already in M7 (driver journey, UI concept, warning flow)."
      },
      "start": "2026-10-26",
      "end": "2026-11-08",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "H5",
      "name": "Board bring-up + on-device ESPDet benchmark",
      "status": "Waiting for hardware",
      "values": {
        "Workstream": "Hardware",
        "Task": "Board bring-up + on-device ESPDet benchmark",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Waiting for hardware",
        "Depends on": "H2,H3",
        "Notes": "Starts after board arrival; validate FPS, latency and real accuracy."
      },
      "start": "2026-11-02",
      "end": "2026-11-22",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "B6",
      "name": "Database schema + hazard storage (users, devices, reports, hazards)",
      "status": "Planned",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Database schema + hazard storage (users, devices, reports, hazards)",
        "Lead": "Rana",
        "Support (who helps, with what)": "Mariam",
        "Status": "Planned",
        "Depends on": "A2",
        "Notes": "Tables from the mobile design (p11): users, devices, reports, hazards, trips, alert_events; unique event_id, geospatial index, retention."
      },
      "start": "2026-11-02",
      "end": "2026-11-22",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "AI5",
      "name": "Benchmark AI model on real ESP32-S3 board",
      "status": "Waiting for hardware",
      "values": {
        "Workstream": "AI & Data",
        "Task": "Benchmark AI model on real ESP32-S3 board",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Waiting for hardware",
        "Depends on": "H5,AI4",
        "Notes": "Real-board accuracy, latency, FPS and memory."
      },
      "start": "2026-11-09",
      "end": "2026-11-29",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "E3",
      "name": "Integrate camera model into real-board firmware",
      "status": "Planned",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Integrate camera model into real-board firmware",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "H5,AI5",
        "Notes": "Replace emulator-only validation with real-board integration."
      },
      "start": "2026-11-09",
      "end": "2026-12-06",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "M2",
      "name": "Mobile app skeleton + local state",
      "status": "Planned",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Mobile app skeleton + local state",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "M1",
        "Notes": ""
      },
      "start": "2026-11-09",
      "end": "2026-11-29",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "H6",
      "name": "Integrate IMU + GPS with prototype",
      "status": "Planned",
      "values": {
        "Workstream": "Hardware",
        "Task": "Integrate IMU + GPS with prototype",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "H5",
        "Notes": "Real sensor integration and calibration."
      },
      "start": "2026-11-16",
      "end": "2026-12-13",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "B2",
      "name": "Device registration + public-key registry",
      "status": "Planned",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Device registration + public-key registry",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz",
        "Status": "Planned",
        "Depends on": "B1,A4",
        "Notes": "Supports sender identity and signature verification."
      },
      "start": "2026-11-16",
      "end": "2026-12-13",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "C3",
      "name": "Hardware key protection + Secure Boot / Flash Encryption",
      "status": "Waiting for hardware",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "Hardware key protection + Secure Boot / Flash Encryption",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Waiting for hardware",
        "Depends on": "H5,C1",
        "Notes": "Depends on final board/bring-up."
      },
      "start": "2026-11-16",
      "end": "2026-12-13",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "E4",
      "name": "Sensor fusion: camera + IMU + GPS Safety Event",
      "status": "Planned",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Sensor fusion: camera + IMU + GPS Safety Event",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "H6,E3",
        "Notes": "Generate the common Safety Event from real sensors."
      },
      "start": "2026-11-23",
      "end": "2026-12-20",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "M3",
      "name": "Hazard warning UI + audio/local alert",
      "status": "Planned",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Hazard warning UI + audio/local alert",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "M2",
        "Notes": ""
      },
      "start": "2026-11-23",
      "end": "2026-12-20",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "H7",
      "name": "Power / vehicle installation prototype",
      "status": "Planned",
      "values": {
        "Workstream": "Hardware",
        "Task": "Power / vehicle installation prototype",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "H5",
        "Notes": "Prototype-only installation and power validation."
      },
      "start": "2026-12-01",
      "end": "2026-12-20",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "AI6",
      "name": "Tune model / thresholds from real recordings",
      "status": "Planned",
      "values": {
        "Workstream": "AI & Data",
        "Task": "Tune model / thresholds from real recordings",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "AI3,AI5",
        "Notes": "Use board and road-test evidence."
      },
      "start": "2026-12-01",
      "end": "2027-01-17",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "B4",
      "name": "Cloud storage / logs / monitoring baseline",
      "status": "Planned",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Cloud storage / logs / monitoring baseline",
        "Lead": "Ahmed",
        "Support (who helps, with what)": "Malak",
        "Status": "Planned",
        "Depends on": "B1",
        "Notes": "IAM, secrets, storage, audit and monitoring baseline."
      },
      "start": "2026-12-01",
      "end": "2027-01-10",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "C4",
      "name": "Backend authentication/RBAC + secret management",
      "status": "Planned",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "Backend authentication/RBAC + secret management",
        "Lead": "Malak",
        "Support (who helps, with what)": "Ahmed",
        "Status": "Planned",
        "Depends on": "A4,B1",
        "Notes": ""
      },
      "start": "2026-12-01",
      "end": "2027-01-10",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "E5",
      "name": "Improve low-density / insider trust scenarios",
      "status": "Planned",
      "values": {
        "Workstream": "Embedded & Trust Engine",
        "Task": "Improve low-density / insider trust scenarios",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz",
        "Status": "Planned",
        "Depends on": "E2",
        "Notes": "Address known trust-engine limitations before system validation."
      },
      "start": "2026-12-14",
      "end": "2027-02-07",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "B5",
      "name": "Backend → vehicle cooperative alert flow",
      "status": "Planned",
      "values": {
        "Workstream": "Backend & Cloud",
        "Task": "Backend → vehicle cooperative alert flow",
        "Lead": "Shahesta",
        "Support (who helps, with what)": "Moaz; Mariam (app side)",
        "Status": "Planned",
        "Depends on": "B3,M3",
        "Notes": "Signed alert + receiver verification path."
      },
      "start": "2026-12-14",
      "end": "2027-01-17",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "M4",
      "name": "Backend/API integration",
      "status": "Planned",
      "values": {
        "Workstream": "Mobile App",
        "Task": "Backend/API integration",
        "Lead": "Mariam",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "B1,M2",
        "Notes": ""
      },
      "start": "2026-12-14",
      "end": "2027-01-17",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "AI7",
      "name": "AI regression dataset + repeatable evaluation",
      "status": "Planned",
      "values": {
        "Workstream": "AI & Data",
        "Task": "AI regression dataset + repeatable evaluation",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "AI6",
        "Notes": "Freeze evaluation set and baseline metrics."
      },
      "start": "2027-01-04",
      "end": "2027-02-14",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "T2",
      "name": "First end-to-end working prototype",
      "status": "Planned",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "First end-to-end working prototype",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "E4,B5,M4",
        "Notes": "Target: January 2027."
      },
      "start": "2027-01-04",
      "end": "2027-01-31",
      "progress": 0,
      "priority": "High"
    },
    {
      "id": "C5",
      "name": "Security/API abuse tests + replay/revocation tests",
      "status": "Planned",
      "values": {
        "Workstream": "Cybersecurity",
        "Task": "Security/API abuse tests + replay/revocation tests",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "B3,B5,C4",
        "Notes": ""
      },
      "start": "2027-01-11",
      "end": "2027-02-07",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "T3",
      "name": "Controlled prototype road tests",
      "status": "Planned",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Controlled prototype road tests",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T2",
        "Notes": "One prototype set; controlled/volunteer testing."
      },
      "start": "2027-02-01",
      "end": "2027-03-15",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "T4",
      "name": "Model / thresholds / trust tuning from field evidence",
      "status": "Planned",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Model / thresholds / trust tuning from field evidence",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T3",
        "Notes": ""
      },
      "start": "2027-02-15",
      "end": "2027-03-31",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "T5",
      "name": "System verification against V-Cycle acceptance criteria",
      "status": "Planned",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "System verification against V-Cycle acceptance criteria",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T3,T4",
        "Notes": "Requirement-by-requirement evidence."
      },
      "start": "2027-03-15",
      "end": "2027-04-30",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "D2",
      "name": "Thesis / final technical report",
      "status": "Planned",
      "values": {
        "Workstream": "Documentation",
        "Task": "Thesis / final technical report",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T3",
        "Notes": ""
      },
      "start": "2027-03-15",
      "end": "2027-05-31",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "T6",
      "name": "Final validation/demo preparation",
      "status": "Planned",
      "values": {
        "Workstream": "Integration & Verification",
        "Task": "Final validation/demo preparation",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T5",
        "Notes": "Final submission date has not been announced."
      },
      "start": "2027-05-01",
      "end": "2027-06-15",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "D3",
      "name": "Final presentation + demo package",
      "status": "Planned",
      "values": {
        "Workstream": "Documentation",
        "Task": "Final presentation + demo package",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Planned",
        "Depends on": "T5",
        "Notes": ""
      },
      "start": "2027-05-01",
      "end": "2027-06-15",
      "progress": 0,
      "priority": "Medium"
    },
    {
      "id": "D4",
      "name": "Expected final university submission window",
      "status": "Waiting for hardware",
      "values": {
        "Workstream": "Documentation",
        "Task": "Expected final university submission window",
        "Lead": "TBD",
        "Support (who helps, with what)": "",
        "Status": "Waiting for hardware",
        "Depends on": "T6,D2,D3",
        "Notes": "University has not announced the date; May/June 2027 expected."
      },
      "start": "2027-05-15",
      "end": "2027-06-30",
      "progress": 0,
      "priority": "Medium"
    }
  ]
};
