/**
 * ข้อมูลรีวิวโบรกเกอร์ Forex 100 อันดับ
 * อ้างอิงอันดับ/เรตติ้งจากแหล่งข้อมูลรีวิวไทย + เรียบเรียงสเปกใหม่
 * โลโก้ดึงอัตโนมัติจาก Clearbit ตาม `domain`
 * ⚠️ ข้อมูลอาจเปลี่ยนแปลง โปรดตรวจสอบกับโบรกเกอร์โดยตรงก่อนตัดสินใจ
 */
export type Broker = {
  rank: number;
  name: string;
  slug: string;
  domain: string;
  rating: number; // 1–5
  leverage: string;
  minDeposit: string;
  regulation: string;
  type: string;
  highlight: string;
  pros: string[];
  cons: string[];
};

type B = Omit<Broker, "pros" | "cons"> & { pros?: string[]; cons?: string[] };

const raw: B[] = [
  { rank: 1, name: "Exness", slug: "exness", domain: "exness.com", rating: 5, leverage: "1:ไม่จำกัด", minDeposit: "$10", regulation: "FCA, CySEC, FSCA, FSA", type: "Hybrid", highlight: "เจ้าตลาดในไทย ถอนเงินอัตโนมัติไวมาก สเปรดต่ำ เลเวอเรจไม่จำกัด", pros: ["ฝาก-ถอนอัตโนมัติ เร็วที่สุดในตลาด", "สเปรดต่ำ มีบัญชี Zero/Raw", "เลเวอเรจไม่จำกัด เปิดบัญชีง่าย"], cons: ["ใบอนุญาต Tier-1 น้อยกว่าเจ้าใหญ่ EU"] },
  { rank: 2, name: "Eightcap", slug: "eightcap", domain: "eightcap.com", rating: 4, leverage: "1:500", minDeposit: "$100", regulation: "ASIC, FCA, CySEC, SCB", type: "Hybrid", highlight: "เชื่อมต่อ TradingView ตรง เหมาะสายเทรดคริปโตและ CFD", pros: ["รวม TradingView ใช้งานง่าย", "สเปรดแข่งขันได้ มีบัญชี Raw"], cons: ["เงินฝากขั้นต่ำสูงกว่าบางเจ้า"] },
  { rank: 3, name: "Tickmill", slug: "tickmill", domain: "tickmill.com", rating: 4, leverage: "1:1000", minDeposit: "$100", regulation: "FCA, CySEC, FSA, FSCA", type: "Hybrid", highlight: "ค่าคอมต่ำ บัญชี Pro สเปรดเริ่ม 0.0 เหมาะ Scalping", pros: ["ค่าคอมมิชชันต่ำ", "กำกับดูแลหลายประเทศ"], cons: ["โปรโมชันน้อย"] },
  { rank: 4, name: "FxPro", slug: "fxpro", domain: "fxpro.com", rating: 4, leverage: "1:ไม่จำกัด", minDeposit: "$100", regulation: "FCA, CySEC, FSCA, SCB", type: "Hybrid", highlight: "โบรกเก่าแก่ มี cTrader ครบ เหมาะเทรดเดอร์มืออาชีพ", pros: ["รองรับ cTrader เต็มรูปแบบ", "ชื่อเสียงยาวนาน"], cons: ["สเปรดบัญชีมาตรฐานสูงกว่า Raw"] },
  { rank: 5, name: "Pepperstone", slug: "pepperstone", domain: "pepperstone.com", rating: 5, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "ASIC, FCA, CySEC, DFSA, SCB", type: "A-book", highlight: "A-book แท้ ส่งคำสั่งไว สเปรดต่ำมาก กำกับดูแลแน่น", pros: ["A-book โปร่งใส ไม่สวนเทรด", "สเปรดต่ำ ส่งคำสั่งเร็ว", "ใบอนุญาต Tier-1 หลายใบ"], cons: ["ไม่มีโบนัสเงินฝาก"] },
  { rank: 6, name: "HFM (HotForex)", slug: "hfm", domain: "hfm.com", rating: 4, leverage: "1:2000", minDeposit: "$0", regulation: "CySEC, FCA, FSCA, DFSA", type: "Hybrid", highlight: "บัญชี Cent + Free Swap เหมาะมือใหม่ทุนน้อย", pros: ["มีบัญชี Cent ทุนน้อย", "โปรโมชันเยอะ"], cons: ["สเปรดบัญชีพื้นฐานปานกลาง"] },
  { rank: 7, name: "IC Markets", slug: "ic-markets", domain: "icmarkets.com", rating: 4, leverage: "1:1000", minDeposit: "$200", regulation: "ASIC, CySEC, FSA", type: "A-book / ECN", highlight: "ECN สเปรดต่ำสุด ๆ ขวัญใจสาย Scalping/EA", pros: ["ECN สเปรดเริ่ม 0.0 จริง", "สภาพคล่องสูง เหมาะรัน EA"], cons: ["เงินฝากขั้นต่ำ $200"] },
  { rank: 8, name: "FBS", slug: "fbs", domain: "fbs.com", rating: 3, leverage: "1:3000", minDeposit: "$5", regulation: "CySEC, ASIC, FSCA, IFSC", type: "Hybrid", highlight: "เลเวอเรจสูงถึง 1:3000 โปรโมชันจัดเต็ม", pros: ["เลเวอเรจสูงมาก", "โบนัสและกิจกรรมเยอะ"], cons: ["สเปรดสูงในบางบัญชี"] },
  { rank: 9, name: "XM", slug: "xm", domain: "xm.com", rating: 5, leverage: "1:1000", minDeposit: "$5", regulation: "CySEC, ASIC, IFSC, DFSA", type: "Hybrid", highlight: "มือใหม่ยอดนิยม บัญชี Micro โบนัส ซัพพอร์ตไทย", pros: ["เปิดบัญชีง่าย มีซัพพอร์ตภาษาไทย", "บัญชี Micro ทุนน้อย", "คอนเทนต์สอนเยอะ"], cons: ["สเปรดสูงกว่าบัญชี ECN"] },
  { rank: 10, name: "Doo Prime", slug: "doo-prime", domain: "dooprime.com", rating: 5, leverage: "1:1000", minDeposit: "$100", regulation: "FCA, ASIC, MAS, FSC", type: "Hybrid / ECN", highlight: "กลุ่มการเงินใหญ่ มีบัญชี ECN/Cent ครบ Copy Trade", pros: ["เครือบริษัทการเงินใหญ่", "มีทั้ง ECN และ Cent"], cons: ["รู้จักในไทยน้อยกว่าเจ้าใหญ่"] },
  { rank: 11, name: "OctaFX", slug: "octafx", domain: "octa.com", rating: 3, leverage: "1:1000", minDeposit: "$25", regulation: "CySEC, FSCA, SVG", type: "Hybrid", highlight: "สเปรดต่ำ Copy Trade ในแอป ฝาก-ถอนสะดวก" },
  { rank: 12, name: "IUX Markets", slug: "iux", domain: "iux.com", rating: 3, leverage: "1:3000", minDeposit: "$1", regulation: "FSCA, SVG", type: "Hybrid", highlight: "ทุนเริ่มต้นต่ำมาก เลเวอเรจสูง กำลังมาแรงในไทย" },
  { rank: 13, name: "XTB", slug: "xtb", domain: "xtb.com", rating: 3, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "FCA, CySEC, KNF", type: "A-book", highlight: "แพลตฟอร์ม xStation ของตัวเองดี จดทะเบียนในตลาดหุ้น" },
  { rank: 14, name: "Weltrade", slug: "weltrade", domain: "weltrade.com", rating: 2, leverage: "1:2000", minDeposit: "$25", regulation: "IFSC, SVG", type: "Hybrid", highlight: "เลเวอเรจสูง โปรโมชันเยอะ เหมาะสายทุนน้อย" },
  { rank: 15, name: "Markets4you", slug: "markets4you", domain: "markets4you.com", rating: 2, leverage: "1:4000", minDeposit: "ไม่กำหนด", regulation: "SVG, FSC", type: "Hybrid", highlight: "เลเวอเรจสูงสุด 1:4000 มีบัญชี Cent" },
  { rank: 16, name: "RoboForex", slug: "roboforex", domain: "roboforex.com", rating: 3, leverage: "1:2000", minDeposit: "$10", regulation: "FSC Belize", type: "Hybrid / ECN", highlight: "เครื่องมือเทรดครบ มี R StocksTrader โปรโมชันเยอะ" },
  { rank: 17, name: "VT Markets", slug: "vt-markets", domain: "vtmarkets.com", rating: 3, leverage: "1:1000", minDeposit: "$100", regulation: "ASIC, FSCA, SVG", type: "Hybrid", highlight: "สเปรดแข่งขันได้ รองรับ TradingView กำลังโต" },
  { rank: 18, name: "Vantage", slug: "vantage", domain: "vantagemarkets.com", rating: 3, leverage: "1:2000", minDeposit: "$50", regulation: "ASIC, FCA, CIMA", type: "Hybrid / ECN", highlight: "บัญชี Raw ECN สเปรดต่ำ มีกำกับดูแล Tier-1" },
  { rank: 19, name: "CXM Direct", slug: "cxm-direct", domain: "cxmdirect.com", rating: 2, leverage: "1:2000", minDeposit: "$50", regulation: "FCA (appointed), SVG", type: "Hybrid", highlight: "เลเวอเรจสูง ฝาก-ถอนสะดวก เหมาะทุนน้อย" },
  { rank: 20, name: "ThinkMarkets", slug: "thinkmarkets", domain: "thinkmarkets.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "FCA, ASIC, CySEC", type: "A-book", highlight: "กำกับดูแลแน่น แพลตฟอร์ม ThinkTrader ของตัวเองดี" },
  { rank: 21, name: "ATFX", slug: "atfx", domain: "atfx.com", rating: 4, leverage: "1:400", minDeposit: "$100", regulation: "FCA, CySEC, FSCA", type: "Hybrid", highlight: "โบรกกำกับดูแลดี เหมาะนักลงทุนเน้นความปลอดภัย" },
  { rank: 22, name: "Swissquote", slug: "swissquote", domain: "swissquote.com", rating: 5, leverage: "1:400", minDeposit: "$1,000", regulation: "FINMA, FCA, MAS", type: "A-book", highlight: "ธนาคารสวิส ความปลอดภัยสูงสุด เหมาะทุนใหญ่" },
  { rank: 23, name: "Saxo Bank", slug: "saxo-bank", domain: "saxobank.com", rating: 5, leverage: "1:30", minDeposit: "ไม่กำหนด", regulation: "FINMA, FCA, MAS, DFSA", type: "A-book", highlight: "ธนาคารเพื่อการลงทุน สินทรัพย์ครบที่สุด เหมาะมืออาชีพ" },
  { rank: 24, name: "FP Markets", slug: "fp-markets", domain: "fpmarkets.com", rating: 4, leverage: "1:500", minDeposit: "$100", regulation: "ASIC, CySEC", type: "A-book / ECN", highlight: "ECN สเปรดต่ำ กำกับดูแลดี เหมาะรัน EA" },
  { rank: 25, name: "Forex.com", slug: "forex-com", domain: "forex.com", rating: 4, leverage: "1:200", minDeposit: "$100", regulation: "CFTC, NFA, FCA", type: "Hybrid", highlight: "โบรกใหญ่ระดับโลก เครือ StoneX กำกับดูแล US" },
  { rank: 26, name: "Interactive Brokers", slug: "interactive-brokers", domain: "interactivebrokers.com", rating: 5, leverage: "1:50", minDeposit: "ไม่กำหนด", regulation: "SEC, FCA, ASIC", type: "A-book", highlight: "บริษัทมหาชน US สินทรัพย์ครบ ค่าธรรมเนียมต่ำ" },
  { rank: 27, name: "Admirals", slug: "admirals", domain: "admirals.com", rating: 4, leverage: "1:1000", minDeposit: "$1", regulation: "FCA, CySEC, ASIC, EFSA", type: "Hybrid", highlight: "กำกับดูแลแน่น เครื่องมือ MetaTrader เสริมครบ" },
  { rank: 28, name: "MultiBank", slug: "multibank", domain: "multibankfx.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "ASIC, CIMA, BaFin", type: "Hybrid", highlight: "กลุ่มการเงินระดับโลก กำกับดูแลหลายประเทศ" },
  { rank: 29, name: "Axi", slug: "axi", domain: "axi.com", rating: 4, leverage: "1:1000", minDeposit: "ไม่กำหนด", regulation: "ASIC, FCA, DFSA", type: "A-book", highlight: "A-book ออสเตรเลีย สเปรดต่ำ มี Copy Trade" },
  { rank: 30, name: "FXOpen", slug: "fxopen", domain: "fxopen.com", rating: 4, leverage: "1:500", minDeposit: "$10", regulation: "FCA, ASIC, CySEC", type: "ECN", highlight: "ECN เก่าแก่ สเปรดต่ำ กำกับดูแลดี" },
  { rank: 31, name: "HTFX", slug: "htfx", domain: "htfx.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "FSA, offshore", type: "Hybrid", highlight: "โบรกกำลังโต โปรโมชันเยอะ เน้นตลาดเอเชีย" },
  { rank: 32, name: "FXCM", slug: "fxcm", domain: "fxcm.com", rating: 4, leverage: "1:1000", minDeposit: "$50", regulation: "FCA, ASIC", type: "Hybrid", highlight: "โบรกเก่าแก่ระดับโลก เครื่องมือวิเคราะห์ครบ" },
  { rank: 33, name: "AvaTrade", slug: "avatrade", domain: "avatrade.com", rating: 3, leverage: "1:400", minDeposit: "$100", regulation: "CBI, ASIC, FSCA, FSA", type: "Hybrid", highlight: "กำกับดูแลหลายประเทศ มีแอปเทรดของตัวเอง" },
  { rank: 34, name: "TMGM", slug: "tmgm", domain: "tmgm.com", rating: 3, leverage: "1:1000", minDeposit: "$100", regulation: "ASIC, VFSC", type: "Hybrid / ECN", highlight: "โบรกออสเตรเลีย สเปรดต่ำ เน้นตลาดเอเชีย" },
  { rank: 35, name: "Capital.com", slug: "capital-com", domain: "capital.com", rating: 4, leverage: "1:300", minDeposit: "$20", regulation: "FCA, CySEC, ASIC, SCB", type: "A-book", highlight: "แพลตฟอร์มใช้ง่าย มี AI ช่วยวิเคราะห์ เหมาะมือใหม่" },
  { rank: 36, name: "InstaForex", slug: "instaforex", domain: "instaforex.com", rating: 3, leverage: "1:1000", minDeposit: "$1", regulation: "FSC, CySEC", type: "Hybrid", highlight: "โบรกเก่าแก่ ทุนเริ่มต้นต่ำ โปรโมชันเยอะ" },
  { rank: 37, name: "Markets.com", slug: "markets-com", domain: "markets.com", rating: 4, leverage: "1:300", minDeposit: "$100", regulation: "CySEC, FCA, ASIC, FSCA", type: "A-book", highlight: "เครือ Finalto กำกับดูแลดี เครื่องมือวิเคราะห์ครบ" },
  { rank: 38, name: "Fxview", slug: "fxview", domain: "fxview.com", rating: 3, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "CySEC, FSC", type: "ECN", highlight: "ค่าธรรมเนียมต่ำ ECN โปร่งใส" },
  { rank: 39, name: "CMC Markets", slug: "cmc-markets", domain: "cmcmarkets.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "FCA, ASIC", type: "A-book", highlight: "บริษัทมหาชน UK สินทรัพย์ครบ แพลตฟอร์มทรงพลัง" },
  { rank: 40, name: "EBC Financial", slug: "ebc-financial", domain: "ebc.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "FCA, ASIC, CIMA", type: "A-book / ECN", highlight: "โบรกกำลังโต กำกับดูแลดี สเปรดแข่งขันได้" },
  { rank: 41, name: "FXGT", slug: "fxgt", domain: "fxgt.com", rating: 3, leverage: "1:5000", minDeposit: "$5", regulation: "FSCA, FSC", type: "Hybrid", highlight: "เลเวอเรจสูงสุด 1:5000 เทรดทั้ง Forex และคริปโต" },
  { rank: 42, name: "GO Markets", slug: "go-markets", domain: "gomarkets.com", rating: 3, leverage: "1:500", minDeposit: "$200", regulation: "ASIC, CySEC, FSC", type: "Hybrid / ECN", highlight: "โบรกออสเตรเลียเก่าแก่ ECN สเปรดต่ำ" },
  { rank: 43, name: "JustMarkets", slug: "justmarkets", domain: "justmarkets.com", rating: 3, leverage: "1:3000", minDeposit: "$1", regulation: "FSCA, FSC, CySEC", type: "Hybrid", highlight: "ทุนเริ่มต้นต่ำ เลเวอเรจสูง กำลังมาในเอเชีย" },
  { rank: 44, name: "Dukascopy", slug: "dukascopy", domain: "dukascopy.com", rating: 3, leverage: "1:200", minDeposit: "$100", regulation: "FINMA, JFSA", type: "A-book / ECN", highlight: "ธนาคารสวิส ECN โปร่งใส เหมาะมืออาชีพ" },
  { rank: 45, name: "IronFX", slug: "ironfx", domain: "ironfx.com", rating: 2, leverage: "1:1000", minDeposit: "$50", regulation: "CySEC, FSCA", type: "Hybrid", highlight: "โบรกเก่าแก่ บัญชีหลากหลาย โปรโมชันเยอะ" },
  { rank: 46, name: "ActivTrades", slug: "activtrades", domain: "activtrades.com", rating: 3, leverage: "1:400", minDeposit: "ไม่กำหนด", regulation: "FCA, SCB, CSSF", type: "A-book", highlight: "โบรก UK กำกับดูแลดี มีประกันเงินทุนเสริม" },
  { rank: 47, name: "easyMarkets", slug: "easymarkets", domain: "easymarkets.com", rating: 3, leverage: "1:400", minDeposit: "$25", regulation: "ASIC, CySEC, FSC", type: "Hybrid", highlight: "เด่นฟีเจอร์ปิดความเสี่ยง Freeze Rate / dealCancellation" },
  { rank: 48, name: "Doto", slug: "doto", domain: "doto.com", rating: 3, leverage: "1:500", minDeposit: "$10", regulation: "CySEC, FSA", type: "Hybrid", highlight: "โบรกใหม่ อินเทอร์เฟซทันสมัย ฝาก-ถอนสะดวก" },
  { rank: 49, name: "Afterprime", slug: "afterprime", domain: "afterprime.com", rating: 3, leverage: "1:1000", minDeposit: "$100", regulation: "FCA (appointed), VFSC", type: "ECN", highlight: "ECN โปร่งใส เปิดเผยข้อมูลราคาจริง" },
  { rank: 50, name: "Zero Markets", slug: "zero-markets", domain: "zeromarkets.com", rating: 2, leverage: "1:500", minDeposit: "$50", regulation: "ASIC, VFSC", type: "Hybrid", highlight: "โบรกออสเตรเลีย สเปรดต่ำ เน้นตลาดเอเชีย" },
  { rank: 51, name: "FXTM", slug: "fxtm", domain: "forextime.com", rating: 4, leverage: "1:2000", minDeposit: "$10", regulation: "FCA, CySEC, FSCA", type: "Hybrid", highlight: "ForexTime กำกับดูแลดี คอนเทนต์สอนเยอะ เหมาะมือใหม่" },
  { rank: 52, name: "LiteFinance", slug: "litefinance", domain: "litefinance.org", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "CySEC, SVG", type: "Hybrid", highlight: "Copy Trade ในตัว ทุนเริ่มต้นต่ำ ใช้งานง่าย" },
  { rank: 53, name: "OANDA", slug: "oanda", domain: "oanda.com", rating: 5, leverage: "1:200", minDeposit: "ไม่กำหนด", regulation: "FCA, ASIC, CFTC, MAS", type: "A-book", highlight: "โบรกระดับโลก น่าเชื่อถือสูง ข้อมูลตลาดละเอียด" },
  { rank: 54, name: "IG", slug: "ig", domain: "ig.com", rating: 5, leverage: "1:200", minDeposit: "ไม่กำหนด", regulation: "FCA, ASIC, MAS", type: "A-book", highlight: "บริษัทมหาชน UK เจ้าใหญ่ CFD สินทรัพย์ครบที่สุด" },
  { rank: 55, name: "Plus500", slug: "plus500", domain: "plus500.com", rating: 4, leverage: "1:300", minDeposit: "$100", regulation: "FCA, ASIC, CySEC", type: "A-book", highlight: "บริษัทจดทะเบียน แพลตฟอร์ม CFD ใช้ง่าย" },
  { rank: 56, name: "eToro", slug: "etoro", domain: "etoro.com", rating: 4, leverage: "1:30", minDeposit: "$50", regulation: "FCA, CySEC, ASIC", type: "A-book", highlight: "เด่น Social/Copy Trading ชุมชนนักเทรดใหญ่" },
  { rank: 57, name: "City Index", slug: "city-index", domain: "cityindex.com", rating: 4, leverage: "1:200", minDeposit: "$100", regulation: "FCA, ASIC, MAS", type: "A-book", highlight: "เครือ StoneX โบรกเก่าแก่ UK เครื่องมือครบ" },
  { rank: 58, name: "BlackBull Markets", slug: "blackbull", domain: "blackbull.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "FMA, FSA", type: "ECN", highlight: "ECN นิวซีแลนด์ สเปรดต่ำ ส่งคำสั่งไว" },
  { rank: 59, name: "Blueberry Markets", slug: "blueberry", domain: "blueberrymarkets.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "ASIC", type: "ECN", highlight: "โบรกออสเตรเลีย บริการลูกค้าดีเด่น สเปรดต่ำ" },
  { rank: 60, name: "Fusion Markets", slug: "fusion-markets", domain: "fusionmarkets.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "ASIC, VFSC", type: "ECN", highlight: "ค่าคอมต่ำที่สุดเจ้าหนึ่ง เหมาะสาย Scalping" },
  { rank: 61, name: "Global Prime", slug: "global-prime", domain: "globalprime.com", rating: 4, leverage: "1:500", minDeposit: "ไม่กำหนด", regulation: "ASIC, VFSC", type: "ECN", highlight: "ECN โปร่งใส เปิดเผย execution จริง" },
  { rank: 62, name: "Skilling", slug: "skilling", domain: "skilling.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "CySEC, FSA", type: "Hybrid", highlight: "แพลตฟอร์มทันสมัย เหมาะมือใหม่ในยุโรป" },
  { rank: 63, name: "NAGA", slug: "naga", domain: "naga.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "CySEC", type: "Hybrid", highlight: "Social Trading + คริปโต ครบในแอปเดียว" },
  { rank: 64, name: "Libertex", slug: "libertex", domain: "libertex.com", rating: 3, leverage: "1:600", minDeposit: "$10", regulation: "CySEC", type: "A-book", highlight: "แพลตฟอร์มใช้ง่าย ค่าธรรมเนียมโปร่งใส" },
  { rank: 65, name: "Trade Nation", slug: "trade-nation", domain: "tradenation.com", rating: 4, leverage: "1:200", minDeposit: "ไม่กำหนด", regulation: "FCA, ASIC, FSCA", type: "A-book", highlight: "สเปรดคงที่ กำกับดูแลดี เหมาะมือใหม่" },
  { rank: 66, name: "Spreadex", slug: "spreadex", domain: "spreadex.com", rating: 4, leverage: "1:200", minDeposit: "ไม่กำหนด", regulation: "FCA", type: "A-book", highlight: "โบรก UK บริการดี รวม Spread Betting" },
  { rank: 67, name: "Tradeview Markets", slug: "tradeview", domain: "tradeviewforex.com", rating: 3, leverage: "1:400", minDeposit: "$100", regulation: "CIMA, MGA", type: "ECN", highlight: "ECN ค่าคอมต่ำ รองรับ cTrader/Currenex" },
  { rank: 68, name: "Hantec Markets", slug: "hantec", domain: "hantecmarkets.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "FCA, FSC", type: "Hybrid", highlight: "โบรกเก่าแก่ฮ่องกง กำกับ FCA น่าเชื่อถือ" },
  { rank: 69, name: "LMAX", slug: "lmax", domain: "lmax.com", rating: 5, leverage: "1:30", minDeposit: "$10,000", regulation: "FCA", type: "A-book / Exchange", highlight: "ระดับสถาบัน Exchange จริง โปร่งใสสูงสุด" },
  { rank: 70, name: "Darwinex", slug: "darwinex", domain: "darwinex.com", rating: 4, leverage: "1:30", minDeposit: "$500", regulation: "FCA", type: "ECN", highlight: "แพลตฟอร์มสำหรับ Money Manager และนักลงทุน" },
  { rank: 71, name: "PU Prime", slug: "pu-prime", domain: "puprime.com", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "ASIC, FSCA, SVG", type: "Hybrid", highlight: "Pacific Union โปรโมชันเยอะ เน้นตลาดเอเชีย" },
  { rank: 72, name: "Errante", slug: "errante", domain: "errante.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "CySEC, FSA", type: "Hybrid", highlight: "โบรกไซปรัส ใช้งานง่าย ซัพพอร์ตหลายภาษา" },
  { rank: 73, name: "PrimeXBT", slug: "primexbt", domain: "primexbt.com", rating: 3, leverage: "1:200", minDeposit: "$10", regulation: "offshore", type: "Hybrid", highlight: "เทรด Forex/คริปโต/ดัชนี ในที่เดียว ทุนเริ่มต้นต่ำ" },
  { rank: 74, name: "Land-FX", slug: "land-fx", domain: "land-fx.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "FCA, VFSC", type: "Hybrid", highlight: "โบรกญี่ปุ่น ส่งคำสั่งไว กำกับ FCA" },
  { rank: 75, name: "Fortrade", slug: "fortrade", domain: "fortrade.com", rating: 3, leverage: "1:200", minDeposit: "$100", regulation: "FCA, ASIC, IIROC", type: "A-book", highlight: "กำกับดูแลหลายประเทศ เหมาะมือใหม่" },
  { rank: 76, name: "Titan FX", slug: "titan-fx", domain: "titanfx.com", rating: 4, leverage: "1:500", minDeposit: "$100", regulation: "VFSC, FSA", type: "ECN", highlight: "ECN สเปรดต่ำ ส่งคำสั่งไว เน้นเทรดเดอร์จริงจัง" },
  { rank: 77, name: "M4Markets", slug: "m4markets", domain: "m4markets.com", rating: 3, leverage: "1:1000", minDeposit: "$5", regulation: "CySEC, FSA", type: "Hybrid", highlight: "ทุนเริ่มต้นต่ำ สเปรด Raw แข่งขันได้" },
  { rank: 78, name: "Trive", slug: "trive", domain: "trive.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "FSCA, CySEC, FSA", type: "Hybrid", highlight: "โบรกหลายสินทรัพย์ กำกับดูแลหลายประเทศ" },
  { rank: 79, name: "Squared Financial", slug: "squared-financial", domain: "squaredfinancial.com", rating: 3, leverage: "1:500", minDeposit: "$250", regulation: "CySEC, FSA", type: "A-book", highlight: "โบรกไซปรัส บริการระดับมืออาชีพ" },
  { rank: 80, name: "ACY Securities", slug: "acy", domain: "acy.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "ASIC, VFSC", type: "ECN", highlight: "โบรกออสเตรเลีย สเปรดต่ำ เครื่องมือวิเคราะห์ครบ" },
  { rank: 81, name: "Moneta Markets", slug: "moneta-markets", domain: "monetamarkets.com", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "FSCA, FSA", type: "Hybrid", highlight: "สเปรดแข่งขันได้ รองรับ TradingView" },
  { rank: 82, name: "STARTRADER", slug: "startrader", domain: "startrader.com", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "FSCA, FSC", type: "Hybrid", highlight: "โบรกกำลังโต โปรโมชันเยอะ เน้นเอเชีย" },
  { rank: 83, name: "Windsor Brokers", slug: "windsor", domain: "windsorbrokers.com", rating: 3, leverage: "1:1000", minDeposit: "$100", regulation: "CySEC, FSA, FSC", type: "Hybrid", highlight: "โบรกเก่าแก่ไซปรัส กว่า 30 ปี" },
  { rank: 84, name: "Alpari", slug: "alpari", domain: "alpari.com", rating: 3, leverage: "1:1000", minDeposit: "$20", regulation: "Mwali, offshore", type: "Hybrid", highlight: "โบรกเก่าแก่ บัญชีหลากหลาย Copy Trade" },
  { rank: 85, name: "NordFX", slug: "nordfx", domain: "nordfx.com", rating: 3, leverage: "1:1000", minDeposit: "$10", regulation: "VFSC", type: "Hybrid", highlight: "ทุนเริ่มต้นต่ำ โปรโมชันเยอะ" },
  { rank: 86, name: "FreshForex", slug: "freshforex", domain: "freshforex.com", rating: 2, leverage: "1:2000", minDeposit: "$0", regulation: "offshore", type: "Hybrid", highlight: "โบนัสและโปรโมชันเยอะ เลเวอเรจสูง" },
  { rank: 87, name: "AMarkets", slug: "amarkets", domain: "amarkets.com", rating: 3, leverage: "1:3000", minDeposit: "$100", regulation: "FSA, The Financial Commission", type: "Hybrid", highlight: "Copy Trade เลเวอเรจสูง เน้นตลาด CIS/เอเชีย" },
  { rank: 88, name: "FIBO Group", slug: "fibo-group", domain: "fibogroup.com", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "CySEC, offshore", type: "Hybrid", highlight: "โบรกเก่าแก่ บัญชี ECN/cTrader" },
  { rank: 89, name: "Grand Capital", slug: "grand-capital", domain: "grandcapital.net", rating: 2, leverage: "1:500", minDeposit: "$10", regulation: "FSC, The Financial Commission", type: "Hybrid", highlight: "บัญชีหลากหลาย รวมไบนารี/หุ้น โปรโมชันเยอะ" },
  { rank: 90, name: "KCM Trade", slug: "kcm-trade", domain: "kcmtrade.com", rating: 3, leverage: "1:1000", minDeposit: "$50", regulation: "ASIC, FSA", type: "Hybrid", highlight: "โบรกกำลังโต สเปรดแข่งขันได้" },
  { rank: 91, name: "OneRoyal", slug: "oneroyal", domain: "oneroyal.com", rating: 3, leverage: "1:2000", minDeposit: "$50", regulation: "ASIC, CySEC, FSA", type: "Hybrid", highlight: "Royal Financial เลเวอเรจสูง กำกับดูแลหลายประเทศ" },
  { rank: 92, name: "Scope Markets", slug: "scope-markets", domain: "scopemarkets.com", rating: 3, leverage: "1:500", minDeposit: "$10", regulation: "CySEC, FSC", type: "Hybrid", highlight: "หลายสินทรัพย์ ทุนเริ่มต้นต่ำ" },
  { rank: 93, name: "FXDD", slug: "fxdd", domain: "fxdd.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "MFSA, offshore", type: "Hybrid", highlight: "โบรกเก่าแก่มอลตา รองรับ MT4/MT5" },
  { rank: 94, name: "Hugo's Way", slug: "hugos-way", domain: "hugosway.com", rating: 3, leverage: "1:500", minDeposit: "$10", regulation: "offshore", type: "ECN", highlight: "ECN ทุนเริ่มต้นต่ำ ฝาก-ถอนคริปโตได้" },
  { rank: 95, name: "Trading.com", slug: "trading-com", domain: "trading.com", rating: 3, leverage: "1:500", minDeposit: "$50", regulation: "ASIC, CySEC", type: "Hybrid", highlight: "เครือ Gain/StoneX แพลตฟอร์มใช้ง่าย" },
  { rank: 96, name: "Axiory", slug: "axiory", domain: "axiory.com", rating: 4, leverage: "1:777", minDeposit: "$10", regulation: "IFSC, FSP", type: "ECN", highlight: "ECN สเปรดต่ำ บริการดี เด่นในเอเชีย" },
  { rank: 97, name: "GKFX Prime", slug: "gkfx-prime", domain: "gkfxprime.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "FSC, offshore", type: "Hybrid", highlight: "โบรกเก่าแก่ รองรับ MT4/MT5" },
  { rank: 98, name: "Varianse", slug: "varianse", domain: "varianse.com", rating: 3, leverage: "1:500", minDeposit: "$100", regulation: "FCA, FSC", type: "ECN", highlight: "ECN กำกับ FCA เหมาะเทรดเดอร์จริงจัง" },
  { rank: 99, name: "ForexMart", slug: "forexmart", domain: "forexmart.com", rating: 2, leverage: "1:500", minDeposit: "$15", regulation: "CySEC, FSC", type: "Hybrid", highlight: "ทุนเริ่มต้นต่ำ โบนัสเยอะ" },
  { rank: 100, name: "Trade.com", slug: "trade-com", domain: "trade.com", rating: 3, leverage: "1:300", minDeposit: "$100", regulation: "CySEC, FSCA", type: "A-book", highlight: "หลายสินทรัพย์ เครื่องมือวิเคราะห์ในตัว" },
];

export const BROKERS: Broker[] = raw.map((b) => ({
  ...b,
  pros: b.pros ?? [],
  cons: b.cons ?? [],
}));
