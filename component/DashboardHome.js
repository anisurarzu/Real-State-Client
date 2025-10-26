import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Skeleton,
  Divider,
  Switch,
  Space,
} from "antd";
import {
  RiseOutlined,
  FallOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import coreAxios from "@/utils/axiosInstance";

const { Title, Text } = Typography;

// Dynamically import Google Fonts
const loadFonts = () => {
  const link1 = document.createElement("link");
  link1.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap";
  link1.rel = "stylesheet";

  const link2 = document.createElement("link");
  link2.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap";
  link2.rel = "stylesheet";

  document.head.appendChild(link1);
  document.head.appendChild(link2);
};

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [language, setLanguage] = useState("en"); // Fixed: Default to 'en'
  const [financialSummary, setFinancialSummary] = useState({
    dailySales: 0,
    totalDailyOrders: 0,
    dailyExpense: 0,
    dailyCashInHand: 0,
    monthlySales: 0,
    totalMonthlyOrders: 0,
    monthlyExpense: 0,
    monthlyCashInHand: 0,
  });
  const [dailyData, setDailyData] = useState([]);

  // Language content
  const content = {
    en: {
      title: "COMPREHENSIVE OVERVIEW OF YOUR BUSINESS PERFORMANCE",
      accessDenied: "Access Denied",
      accessDeniedMessage: "You don't have permission to access this page",
      dailySales: "Daily Sales",
      dailyExpenses: "Daily Expenses",
      dailyOrders: "Daily Orders",
      dailyCashInHand: "Daily Cash In Hand",
      monthlySales: "Monthly Sales",
      monthlyExpenses: "Monthly Expenses",
      monthlyOrders: "Monthly Orders",
      monthlyCashInHand: "Monthly Cash In Hand",
      performanceTrends: "DAILY PERFORMANCE TRENDS",
      performanceSubtitle: "Visualized data for better decision making",
      sales: "Daily Sales",
      orders: "Total Orders",
      expenses: "Daily Expenses",
      vsYesterday: "vs yesterday",
      english: "EN",
      bangla: "BN",
      language: "Language",
    },
    bn: {
      title: "আপনার ব্যবসার কর্মদক্ষতার সম্পূর্ণ বিবরণ",
      accessDenied: "অ্যাক্সেস ডিনাইড",
      accessDeniedMessage: "আপনার এই পৃষ্ঠাটি অ্যাক্সেস করার অনুমতি নেই",
      dailySales: "দৈনিক বিক্রয়",
      dailyExpenses: "দৈনিক ব্যয়",
      dailyOrders: "দৈনিক অর্ডার",
      dailyCashInHand: "দৈনিক নগদ অর্থ",
      monthlySales: "মাসিক বিক্রয়",
      monthlyExpenses: "মাসিক ব্যয়",
      monthlyOrders: "মাসিক অর্ডার",
      monthlyCashInHand: "মাসিক নগদ অর্থ",
      performanceTrends: "দৈনিক কর্মদক্ষতার প্রবণতা",
      performanceSubtitle: "ভালো সিদ্ধান্ত নেওয়ার জন্য ভিজ্যুয়াল ডেটা",
      sales: "দৈনিক বিক্রয়",
      orders: "মোট অর্ডার",
      expenses: "দৈনিক ব্যয়",
      vsYesterday: "গতকালের তুলনায়",
      english: "EN",
      bangla: "BN",
      language: "ভাষা",
    },
  };

  const t = content[language];

  useEffect(() => {
    loadFonts();
    // Get user info from localStorage first
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUserInfo);

    // Only fetch data if user has view access
    if (storedUserInfo?.pagePermissions?.[0]?.viewAccess) {
      getSummery();
      getDailySummary();
    } else {
      setLoading(false);
    }
  }, []);

  const getSummery = async () => {
    try {
      const res = await coreAxios.get(`getFinancialSummary`);
      if (res?.status === 200) {
        setFinancialSummary(res.data);
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error);
    }
  };

  const getDailySummary = async () => {
    try {
      const res = await coreAxios.get("getDailySummary");
      if (res?.status === 200) {
        setDailyData(res.data);
      }
    } catch (error) {
      console.error("Error fetching daily summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformedData = dailyData?.flatMap((item) => [
    {
      date: new Date(item.date).toLocaleDateString(),
      type: t.sales,
      value: item.dailySales,
    },
    {
      date: new Date(item.date).toLocaleDateString(),
      type: t.orders,
      value: item.totalOrders,
    },
    {
      date: new Date(item.date).toLocaleDateString(),
      type: t.expenses,
      value: item.dailyExpense,
    },
  ]);

  const lineChartConfig = {
    data: transformedData,
    xField: "date",
    yField: "value",
    seriesField: "type",
    color: ["#6ECB63", "#5B8FF9", "#FF6B6B"],
    xAxis: {
      label: {
        style: {
          fontSize: 12,
          fill: "#666",
          fontFamily: "Inter, sans-serif",
        },
      },
      tickCount: 7,
      line: {
        style: {
          stroke: "#E8E8E8",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 12,
          fill: "#666",
          fontFamily: "Inter, sans-serif",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#F0F0F0",
            lineDash: [4, 4],
          },
        },
      },
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "#FFF",
        stroke: "#6ECB63",
        lineWidth: 2,
      },
    },
    lineStyle: { lineWidth: 3 },
    tooltip: {
      showTitle: true,
      domStyles: {
        "g2-tooltip": {
          fontFamily: "Inter, sans-serif",
          background: "rgba(255, 255, 255, 0.98)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          borderRadius: "8px",
          padding: "16px",
          border: "1px solid #f0f0f0",
        },
      },
    },
    smooth: true,
    interactions: [{ type: "tooltip" }],
    legend: {
      position: "top-right",
      itemName: {
        style: {
          fill: "#666",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    animation: {
      appear: {
        animation: "path-in",
        duration: 2000,
      },
    },
  };

  const getIconForStat = (label) => {
    if (label === t.dailySales || label === t.monthlySales) {
      return <RiseOutlined style={{ fontSize: "18px" }} />;
    }
    if (label === t.dailyExpenses || label === t.monthlyExpenses) {
      return <FallOutlined style={{ fontSize: "18px" }} />;
    }
    if (label === t.dailyOrders || label === t.monthlyOrders) {
      return <ShoppingOutlined style={{ fontSize: "18px" }} />;
    }
    return <DollarOutlined style={{ fontSize: "18px" }} />;
  };

  const getColorForStat = (label) => {
    if (label === t.dailySales || label === t.monthlySales) return "#6ECB63";
    if (label === t.dailyExpenses || label === t.monthlyExpenses)
      return "#FF6B6B";
    if (label === t.dailyOrders || label === t.monthlyOrders) return "#5B8FF9";
    return "#F7C847";
  };

  const getTrendIndicator = (label) => {
    const isPositive =
      label === t.dailySales ||
      label === t.monthlySales ||
      label === t.dailyOrders ||
      label === t.monthlyOrders;
    return isPositive ? (
      <ArrowUpOutlined style={{ color: "#6ECB63", fontSize: "14px" }} />
    ) : (
      <ArrowDownOutlined style={{ color: "#FF6B6B", fontSize: "14px" }} />
    );
  };

  const handleLanguageChange = (checked) => {
    setLanguage(checked ? "bn" : "en");
  };

  // Language toggle component - Always render this
  // const LanguageToggle = () => (

  // );

  if (loading) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden bg-gray-50">
        <div className="absolute top-6 right-6 z-20">
          <Card
            className="rounded-xl shadow-lg border-0"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(4px)",
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Space align="center">
              <GlobalOutlined style={{ color: "#64748B", fontSize: "16px" }} />
              <Text
                strong
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                {t.language}
              </Text>
              <Switch
                checked={language === "bn"}
                onChange={handleLanguageChange}
                checkedChildren={t.bangla}
                unCheckedChildren={t.english}
                style={{
                  backgroundColor: language === "bn" ? "#6ECB63" : "#d9d9d9",
                }}
              />
            </Space>
          </Card>
        </div>
        Hii
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 1 }} className="max-w-md" />
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item}>
                <Card className="shadow-lg rounded-xl border-0">
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
          <Divider />
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden bg-gray-50">
      {/* Gradient Header with Waves */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-[#6ECB63] to-[#5B8FF9] overflow-hidden z-0">
        <svg
          className="absolute bottom-0 left-0 right-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255, 255, 255, 0.3)"
            d="M0,256L48,261.3C96,267,192,277,288,250.7C384,224,480,160,576,160C672,160,768,224,864,218.7C960,213,1056,139,1152,117.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Language Toggle - Always visible */}
      <LanguageToggle />

      <div className="relative z-10">
        {userInfo?.pagePermissions?.[0]?.viewAccess === true ? (
          <div>
            <div className="mb-12 pt-4">
              <Title
                level={1}
                className="text-white mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontSize: "1.8rem",
                  marginTop: "20px",
                }}
              >
                {t.title}
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              {[
                {
                  label: t.dailySales,
                  value: financialSummary.dailySales,
                  change: "+12%",
                },
                {
                  label: t.dailyExpenses,
                  value: financialSummary.dailyExpense,
                  change: "-5%",
                },
                {
                  label: t.dailyOrders,
                  value: financialSummary.totalDailyOrders,
                  change: "+8%",
                },
                {
                  label: t.dailyCashInHand,
                  value: financialSummary.dailyCashInHand,
                  change: "+3%",
                },
                {
                  label: t.monthlySales,
                  value: financialSummary.monthlySales,
                  change: "+15%",
                },
                {
                  label: t.monthlyExpenses,
                  value: financialSummary.monthlyExpense,
                  change: "-2%",
                },
                {
                  label: t.monthlyOrders,
                  value: financialSummary.totalMonthlyOrders,
                  change: "+10%",
                },
                {
                  label: t.monthlyCashInHand,
                  value: financialSummary.monthlyCashInHand,
                  change: "+5%",
                },
              ].map((item, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                  <Card
                    hoverable
                    bordered={false}
                    className="rounded-xl overflow-hidden border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      transition: "all 0.3s ease",
                    }}
                    bodyStyle={{ padding: "20px" }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Text
                          type="secondary"
                          className="text-sm uppercase tracking-wider"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            color: "#64748B",
                          }}
                        >
                          {item.label}
                        </Text>
                        <Title
                          level={2}
                          className="mt-1 mb-0"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "1.75rem",
                            color: "#1E293B",
                          }}
                        >
                          {typeof item.value === "number"
                            ? `৳${item.value.toLocaleString()}`
                            : item.value}
                        </Title>
                        <div className="flex items-center mt-2">
                          {getTrendIndicator(item.label)}
                          <Text
                            style={{
                              color: item.change.startsWith("+")
                                ? "#6ECB63"
                                : "#FF6B6B",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.875rem",
                              marginLeft: "4px",
                            }}
                          >
                            {item.change} {t.vsYesterday}
                          </Text>
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${getColorForStat(item.label)}15`,
                          color: getColorForStat(item.label),
                          border: `1px solid ${getColorForStat(item.label)}30`,
                          width: "48px",
                          height: "48px",
                        }}
                      >
                        {getIconForStat(item.label)}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider className="my-10" />

            <div
              className="bg-white rounded-xl p-8 shadow-xl border border-gray-100"
              style={{
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.03)",
              }}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Title
                    level={3}
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    {t.performanceTrends}
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "#64748B",
                    }}
                  >
                    {t.performanceSubtitle}
                  </Text>
                </div>
                <div className="flex space-x-4">
                  {[t.sales, t.orders, t.expenses].map((item) => (
                    <div key={item} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            item === t.sales
                              ? "#6ECB63"
                              : item === t.orders
                              ? "#5B8FF9"
                              : "#FF6B6B",
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#64748B",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
              <Line {...lineChartConfig} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md">
              <Title level={3} className="text-[#FF6B6B]">
                {t.accessDenied}
              </Title>
              <Text className="text-gray-600 mt-2 block">
                {t.accessDeniedMessage}
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
