"use client";

import React from "react";
import {
  Layout,
  Menu,
  Button,
  Skeleton,
  Drawer,
  Avatar,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  List,
  Tag,
  message,
  Progress,
  Switch,
  Space,
} from "antd";
import {
  DashboardOutlined,
  MenuOutlined,
  LogoutOutlined,
  HomeOutlined,
  DollarCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  StarOutlined,
  TrophyOutlined,
  RocketOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import coreAxios from "@/utils/axiosInstance";
import PropertyAddition from "@/component/PropertyAddition";
import AccountsManagement from "@/component/AccountsManagement";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Language content
const content = {
  en: {
    dashboard: "Dashboard",
    propertyListings: "Property Listings",
    clientManagement: "Client Management",
    appointment: "Appointment",
    yourRealEstatePerformance: "Your Real Estate Performance Summary",
    refreshData: "Refresh Data",
    totalProperties: "Total Properties",
    allProperties: "All Properties",
    thisMonth: "this month",
    monthlyIncome: "Monthly Income",
    monthlyRevenue: "Monthly Revenue",
    fromLastMonth: "from last month",
    activeClients: "Active Clients",
    totalClients: "Total Clients",
    newClients: "new clients",
    performance: "Performance",
    successRate: "Success Rate",
    soldProperties: "Sold Properties",
    availableProperties: "Available Properties",
    currentlyListed: "Currently Listed",
    pendingAppointments: "Pending Appointments",
    toConfirm: "To Confirm",
    trendingProperties: "Trending Properties",
    properties: "Properties",
    trending: "Trending",
    stable: "Stable",
    views: "views",
    recentAppointments: "Recent Appointments",
    appointments: "Appointments",
    client: "Client",
    property: "Property",
    date: "Date",
    time: "Time",
    status: "Status",
    completed: "Completed",
    pending: "Pending",
    confirmed: "Confirmed",
    byPropertyType: "By Property Type",
    quickActions: "Quick Actions",
    addNewProperty: "Add New Property",
    propertyAdditionFeature: "Property addition feature coming soon",
    scheduleAppointment: "Schedule Appointment",
    appointmentSchedulingFeature: "Appointment scheduling feature coming soon",
    clientManagementFeature: "Client management feature coming soon",
    manageClients: "Manage Clients",
    apartment: "Apartment",
    houseVilla: "House/Villa",
    plot: "Plot",
    commercial: "Commercial",
    permissionDenied: "Permission Denied",
    language: "Language",
    english: "EN",
    bangla: "BN",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    propertyListings: "প্রোপার্টি লিস্টিং",
    clientManagement: "ক্লায়েন্ট ম্যানেজমেন্ট",
    appointment: "অ্যাপয়েন্টমেন্ট",
    yourRealEstatePerformance: "আপনার রিয়েল এস্টেট পারফরম্যান্স সারাংশ",
    refreshData: "রিফ্রেশ ডেটা",
    totalProperties: "মোট প্রোপার্টি",
    allProperties: "সকল প্রোপার্টি",
    thisMonth: "এই মাসে",
    monthlyIncome: "মাসিক আয়",
    monthlyRevenue: "মাসিক রাজস্ব",
    fromLastMonth: "গত মাস থেকে",
    activeClients: "সক্রিয় ক্লায়েন্ট",
    totalClients: "মোট ক্লায়েন্ট",
    newClients: "নতুন ক্লায়েন্ট",
    performance: "পারফরম্যান্স",
    successRate: "সাফল্যের হার",
    soldProperties: "বিক্রিত প্রোপার্টি",
    availableProperties: "উপলব্ধ প্রোপার্টি",
    currentlyListed: "বর্তমানে লিস্টেড",
    pendingAppointments: "মুলতুবি অ্যাপয়েন্টমেন্ট",
    toConfirm: "নিশ্চিত করার জন্য",
    trendingProperties: "ট্রেন্ডিং প্রোপার্টি",
    properties: "প্রোপার্টি",
    trending: "ট্রেন্ডিং",
    stable: "স্টেবল",
    views: "ভিউ",
    recentAppointments: "সাম্প্রতিক অ্যাপয়েন্টমেন্ট",
    appointments: "অ্যাপয়েন্টমেন্ট",
    client: "ক্লায়েন্ট",
    property: "প্রোপার্টি",
    date: "তারিখ",
    time: "সময়",
    status: "স্ট্যাটাস",
    completed: "সম্পন্ন",
    pending: "মুলতুবি",
    confirmed: "নিশ্চিত",
    byPropertyType: "প্রোপার্টি টাইপ অনুযায়ী",
    quickActions: "দ্রুত কর্ম",
    addNewProperty: "নতুন প্রোপার্টি যোগ করুন",
    propertyAdditionFeature: "নতুন প্রোপার্টি যোগ করার ফিচার শীঘ্রই আসছে",
    scheduleAppointment: "অ্যাপয়েন্টমেন্ট শিডিউল",
    appointmentSchedulingFeature: "অ্যাপয়েন্টমেন্ট শিডিউল ফিচার শীঘ্রই আসছে",
    clientManagementFeature: "ক্লায়েন্ট ব্যবস্থাপনা ফিচার শীঘ্রই আসছে",
    manageClients: "ক্লায়েন্ট ব্যবস্থাপনা",
    apartment: "আপার্টমেন্ট",
    houseVilla: "বাড়ি/ভিলা",
    plot: "প্লট",
    commercial: "কমার্শিয়াল",
    permissionDenied: "অনুমতি নেই",
    language: "ভাষা",
    english: "EN",
    bangla: "BN",
  },
};

// Role permissions with dynamic labels
const getRolePermissions = (language) => {
  const t = content[language];
  return {
    superadmin: [
      { key: "1", label: t.dashboard, icon: <DashboardOutlined /> },
      { key: "2", label: t.propertyListings, icon: <HomeOutlined /> },
      { key: "3", label: t.clientManagement, icon: <UserOutlined /> },
      { key: "4", label: t.appointment, icon: <CalendarOutlined /> },
    ],
    agent: [
      { key: "1", label: t.dashboard, icon: <DashboardOutlined /> },
      { key: "2", label: t.propertyListings, icon: <HomeOutlined /> },
      { key: "3", label: t.clientManagement, icon: <UserOutlined /> },
      { key: "4", label: t.appointment, icon: <CalendarOutlined /> },
    ],
    support: [
      { key: "1", label: t.dashboard, icon: <DashboardOutlined /> },
      { key: "2", label: t.propertyListings, icon: <HomeOutlined /> },
    ],
  };
};

// Real Estate Dashboard Content Component
const DashboardContent = ({ userInfo, language }) => {
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    totalClients: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    performance: 0,
    trendingProperties: [],
    recentAppointments: [],
    propertyTypes: [],
  });
  const [loading, setLoading] = useState(true);

  const t = content[language];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data with more attractive numbers
      setDashboardData({
        totalProperties: 156,
        availableProperties: 89,
        soldProperties: 67,
        totalClients: 234,
        pendingAppointments: 18,
        monthlyRevenue: 28750000,
        performance: 78,
        trendingProperties: [
          {
            name: language === "bn" ? "গুলশান পেন্টহাউস" : "Gulshan Penthouse",
            price: "4.5Cr",
            views: 156,
            trend: "up",
          },
          {
            name:
              language === "bn"
                ? "বনানী লাক্সারী ফ্ল্যাট"
                : "Banani Luxury Flat",
            price: "2.8Cr",
            views: 134,
            trend: "up",
          },
          {
            name: language === "bn" ? "বারিধারা ডুপ্লেক্স" : "Baridhara Duplex",
            price: "3.2Cr",
            views: 98,
            trend: "stable",
          },
          {
            name:
              language === "bn"
                ? "উত্তরা লেকসাইড হাউস"
                : "Uttara Lakeside House",
            price: "1.9Cr",
            views: 87,
            trend: "up",
          },
        ],
        recentAppointments: [
          {
            client: language === "bn" ? "আহমেদ হাসান" : "Ahmed Hasan",
            property:
              language === "bn" ? "গুলশান পেন্টহাউস" : "Gulshan Penthouse",
            date: language === "bn" ? "১৫/১২/২০২৪" : "15/12/2024",
            time: language === "bn" ? "০৩:০০ PM" : "03:00 PM",
            status: "Confirmed",
            priority: "high",
          },
          {
            client: language === "bn" ? "ফারহানা ইসলাম" : "Farhana Islam",
            property:
              language === "bn" ? "বনানী আপার্টমেন্ট" : "Banani Apartment",
            date: language === "bn" ? "১৪/১২/২০২৪" : "14/12/2024",
            time: language === "bn" ? "১১:০০ AM" : "11:00 AM",
            status: "Pending",
            priority: "medium",
          },
          {
            client: language === "bn" ? "রাজীব আহমেদ" : "Rajib Ahmed",
            property: language === "bn" ? "ধানমন্ডি ফ্ল্যাট" : "Dhanmondi Flat",
            date: language === "bn" ? "১৩/১২/২০২৪" : "13/12/2024",
            time: language === "bn" ? "০৪:৩০ PM" : "04:30 PM",
            status: "Completed",
            priority: "low",
          },
          {
            client: language === "bn" ? "নুসরাত জাহান" : "Nusrat Jahan",
            property: language === "bn" ? "বারিধারা ভিলা" : "Baridhara Villa",
            date: language === "bn" ? "১২/১২/২০২৪" : "12/12/2024",
            time: language === "bn" ? "০২:১৫ PM" : "02:15 PM",
            status: "Confirmed",
            priority: "high",
          },
        ],
        propertyTypes: [
          { name: t.apartment, count: 67, color: "#3B82F6" },
          { name: t.houseVilla, count: 45, color: "#10B981" },
          { name: t.plot, count: 28, color: "#8B5CF6" },
          { name: t.commercial, count: 16, color: "#F59E0B" },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error(
        language === "bn" ? "ডেটা লোড করতে সমস্যা হয়েছে" : "Error loading data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [language]);

  const refreshData = () => {
    fetchDashboardData();
    message.success(
      language === "bn" ? "ডেটা রিফ্রেশ করা হয়েছে!" : "Data refreshed!"
    );
  };

  // Color schemes for different cards
  const cardGradients = {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    warning: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    info: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    purple: "linear-gradient(135deg, #a78bfa 0%, #7dd3fc 100%)",
    orange: "linear-gradient(135deg, #fdba74 0%, #fb923c 100%)",
    teal: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
    rose: "linear-gradient(135deg, #fb7185 0%, #f472b6 100%)",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 1 }} className="max-w-md" />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((item) => (
            <Col xs={24} sm={12} md={6} key={item}>
              <Card className="shadow-lg rounded-xl border-0">
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <Text className="text-gray-600 text-lg">
            {t.yourRealEstatePerformance}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={refreshData}
          className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-10 px-6"
        >
          {t.refreshData}
        </Button>
      </div>

      {/* Main Metrics with Attractive Cards */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1"
            bodyStyle={{
              background: cardGradients.primary,
              borderRadius: "12px",
              padding: "24px",
              color: "white",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-opacity-80 text-sm font-medium mb-2">
                  {t.totalProperties}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.totalProperties}
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  {t.allProperties}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <HomeOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +12% {t.thisMonth}
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1"
            bodyStyle={{
              background: cardGradients.success,
              borderRadius: "12px",
              padding: "24px",
              color: "white",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-opacity-80 text-sm font-medium mb-2">
                  {t.monthlyIncome}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {(dashboardData.monthlyRevenue / 10000000).toFixed(1)}Cr
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  {t.monthlyRevenue}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarCircleOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +23% {t.fromLastMonth}
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1"
            bodyStyle={{
              background: cardGradients.warning,
              borderRadius: "12px",
              padding: "24px",
              color: "white",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-opacity-80 text-sm font-medium mb-2">
                  {t.activeClients}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.totalClients}
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  {t.totalClients}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +8% {t.newClients}
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1"
            bodyStyle={{
              background: cardGradients.info,
              borderRadius: "12px",
              padding: "24px",
              color: "white",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-opacity-80 text-sm font-medium mb-2">
                  {t.performance}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.performance}%
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  {t.successRate}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrophyOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <Progress
                percent={dashboardData.performance}
                size="small"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.3)"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <Card
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">
                  {t.soldProperties}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.soldProperties}
                </div>
                <div className="text-gray-500 text-xs">{t.thisMonth}</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <HomeOutlined className="text-lg text-green-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">
                  {t.availableProperties}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.availableProperties}
                </div>
                <div className="text-gray-500 text-xs">{t.currentlyListed}</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <EyeOutlined className="text-lg text-blue-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">
                  {t.pendingAppointments}
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData.pendingAppointments}
                </div>
                <div className="text-gray-500 text-xs">{t.toConfirm}</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <CalendarOutlined className="text-lg text-orange-600" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Trending Properties and Recent Appointments */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <RocketOutlined className="text-purple-600 mr-2" />
                <span className="text-lg font-bold text-gray-800">
                  {t.trendingProperties}
                </span>
              </div>
            }
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 20px",
            }}
            extra={
              <Tag color="purple">
                {dashboardData.trendingProperties.length} {t.properties}
              </Tag>
            }
          >
            <List
              dataSource={dashboardData.trendingProperties}
              renderItem={(item, index) => (
                <List.Item className="border-0 !px-0 !py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          item.trend === "up"
                            ? "bg-green-500"
                            : item.trend === "down"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.price} • {item.views} {t.views}
                        </div>
                      </div>
                    </div>
                    <Tag
                      color={
                        item.trend === "up"
                          ? "green"
                          : item.trend === "down"
                          ? "red"
                          : "orange"
                      }
                      icon={
                        item.trend === "up" ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )
                      }
                    >
                      {item.trend === "up" ? t.trending : t.stable}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <CalendarOutlined className="text-green-600 mr-2" />
                <span className="text-lg font-bold text-gray-800">
                  {t.recentAppointments}
                </span>
              </div>
            }
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 20px",
            }}
            extra={
              <Tag color="green">
                {dashboardData.recentAppointments.length} {t.appointments}
              </Tag>
            }
          >
            <List
              dataSource={dashboardData.recentAppointments}
              renderItem={(item, index) => (
                <List.Item className="border-0 !px-0 !py-3">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {item.client}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.property}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.date} • {item.time}
                      </div>
                    </div>
                    <Tag
                      color={
                        item.status === "Completed"
                          ? "green"
                          : item.status === "Pending"
                          ? "orange"
                          : "blue"
                      }
                      className={
                        item.priority === "high"
                          ? "border-red-500 text-red-500"
                          : ""
                      }
                    >
                      {item.status === "Completed"
                        ? t.completed
                        : item.status === "Pending"
                        ? t.pending
                        : t.confirmed}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Property Types and Quick Actions */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <StarOutlined className="text-blue-600 mr-2" />
                <span className="text-lg font-bold text-gray-800">
                  {t.byPropertyType}
                </span>
              </div>
            }
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 20px",
            }}
          >
            <div className="space-y-4">
              {dashboardData.propertyTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {type.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800 mr-2">
                      {type.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      {t.properties}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <PlusOutlined className="text-purple-600 mr-2" />
                <span className="text-lg font-bold text-gray-800">
                  {t.quickActions}
                </span>
              </div>
            }
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 20px",
            }}
          >
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="h-12 text-lg bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => message.info(t.propertyAdditionFeature)}
              >
                {t.addNewProperty}
              </Button>
              <Button
                icon={<CalendarOutlined />}
                className="h-12 text-lg border-green-500 text-green-500 hover:bg-green-50 transition-all duration-300"
                onClick={() => message.info(t.appointmentSchedulingFeature)}
              >
                {t.scheduleAppointment}
              </Button>
              <Button
                icon={<UserOutlined />}
                className="h-12 text-lg border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-300"
                onClick={() => message.info(t.clientManagementFeature)}
              >
                {t.manageClients}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Simple placeholder components for other menu items
const PropertyListings = ({ language }) => {
  const t = content[language];
  return (
    <Card className="border-0 shadow-2xl rounded-2xl">
      <div className="text-center py-8">
        <HomeOutlined className="text-6xl text-blue-500 mb-4" />
        <Title level={3} className="text-gray-800">
          {t.propertyListings}
        </Title>
        <Text className="text-gray-600 text-lg">
          {language === "bn"
            ? "প্রোপার্টি লিস্টিং ব্যবস্থাপনা শীঘ্রই আসছে..."
            : "Property listing management coming soon..."}
        </Text>
      </div>
    </Card>
  );
};

const ClientManagement = ({ language }) => {
  const t = content[language];
  return (
    <Card className="border-0 shadow-2xl rounded-2xl">
      <div className="text-center py-8">
        <UserOutlined className="text-6xl text-green-500 mb-4" />
        <Title level={3} className="text-gray-800">
          {t.clientManagement}
        </Title>
        <Text className="text-gray-600 text-lg">
          {language === "bn"
            ? "ক্লায়েন্ট ব্যবস্থাপনা শীঘ্রই আসছে..."
            : "Client management coming soon..."}
        </Text>
      </div>
    </Card>
  );
};

const AppointmentManagement = ({ language }) => {
  const t = content[language];
  return (
    <Card className="border-0 shadow-2xl rounded-2xl">
      <div className="text-center py-8">
        <CalendarOutlined className="text-6xl text-orange-500 mb-4" />
        <Title level={3} className="text-gray-800">
          {t.appointment}
        </Title>
        <Text className="text-gray-600 text-lg">
          {language === "bn"
            ? "অ্যাপয়েন্টমেন্ট শিডিউলিং শীঘ্রই আসছে..."
            : "Appointment scheduling coming soon..."}
        </Text>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [language, setLanguage] = useState("en"); // Default to English

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [router, selectedMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  const handleLanguageChange = (checked) => {
    setLanguage(checked ? "bn" : "en");
  };

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const t = content[language];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 1 }} className="max-w-md" />
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item}>
                <Card className="shadow-lg rounded-xl border-0">
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    if (!userInfo) return null;

    // Render content based on selected menu
    switch (selectedMenu) {
      case "1":
        return <DashboardContent userInfo={userInfo} language={language} />;
      case "2":
        return <PropertyAddition language={language} />;
      case "3":
        return <AccountsManagement language={language} />;
      case "4":
        return <AppointmentManagement language={language} />;
      default:
        return <div>{t.permissionDenied}</div>;
    }
  };

  const renderMenuItems = () => {
    if (!userInfo) return null;

    const userRole = userInfo?.role?.value || "agent";
    const rolePermissions = getRolePermissions(language);
    const allowedPages = rolePermissions[userRole] || rolePermissions.agent;

    return (
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedMenu]}
        onClick={(e) => setSelectedMenu(e.key)}
        className="bg-white border-r-0"
      >
        {allowedPages.map((page) => (
          <Menu.Item
            key={page.key}
            icon={page.icon}
            className="!bg-white hover:!bg-[#1E40AF] !text-gray-600 hover:!text-white [&.ant-menu-item-selected]:!bg-[#1E40AF] [&.ant-menu-item-selected]:!text-white !h-12 !flex !items-center !text-base"
          >
            <span className="font-medium">{page.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="hidden lg:block bg-white shadow-lg"
        width={220}
        breakpoint="lg"
        trigger={null}
      >
        <div className="logo-container my-6 flex items-center justify-center">
          <div className={`flex items-center ${collapsed ? "px-2" : "px-4"}`}>
            <div
              className={`rounded-lg bg-white p-1 ${
                collapsed ? "w-14" : "w-16"
              }`}
            >
              <HomeOutlined
                className={`text-blue-600 ${
                  collapsed ? "text-2xl" : "text-3xl"
                }`}
              />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <div className="text-lg font-bold text-[#1E40AF]">
                  RealEstate
                </div>
                <div className="text-xs text-gray-600 -mt-1">প্রো</div>
              </div>
            )}
          </div>
        </div>

        {renderMenuItems()}
      </Sider>

      {/* Drawer for Mobile */}
      <Drawer
        title={
          <div className="flex items-center">
            <div className="w-14 rounded-lg bg-white p-1 mr-3">
              <HomeOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">RealEstate</div>
              <div className="text-xs text-gray-200 -mt-1">প্রো</div>
            </div>
          </div>
        }
        placement="left"
        onClose={onClose}
        open={visible}
        width="70vw"
        bodyStyle={{ padding: 0 }}
        headerStyle={{ background: "#1E40AF", color: "white" }}
      >
        {renderMenuItems()}
      </Drawer>

      <Layout className="site-layout">
        <Header
          style={{
            background: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
          className="flex justify-between items-center px-6 py-4"
        >
          <div className="flex items-center">
            <Button
              icon={<MenuOutlined />}
              className="lg:hidden text-[#1E40AF] border-none mr-4"
              onClick={showDrawer}
            />
            <div className="hidden lg:block">
              <Title level={4} className="mb-0 text-gray-800">
                {
                  getRolePermissions(language)[
                    userInfo?.role?.value || "agent"
                  ]?.find((item) => item.key === selectedMenu)?.label
                }
              </Title>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle Button */}
            <div className="flex items-center space-x-2 mr-4">
              <GlobalOutlined className="text-gray-600" />
              <Switch
                checked={language === "bn"}
                onChange={handleLanguageChange}
                checkedChildren={t.bangla}
                unCheckedChildren={t.english}
                size="small"
              />
              <Text className="text-gray-600 text-sm hidden sm:block">
                {t.language}
              </Text>
            </div>

            {userInfo && (
              <div className="flex items-center space-x-3">
                <Avatar
                  src={
                    userInfo?.imageUrl
                      ? `data:image/jpeg;base64,${userInfo.imageUrl}`
                      : null
                  }
                  alt={userInfo.username || "User"}
                  size={40}
                  className="border-2 border-[#1E40AF]"
                >
                  {!userInfo?.imageUrl &&
                    (userInfo.username || "User").charAt(0).toUpperCase()}
                </Avatar>
                <div className="hidden md:flex flex-col">
                  <span className="font-medium text-gray-800 leading-5">
                    {userInfo.username || "User"}
                  </span>
                  <span className="text-xs text-gray-500 leading-4 mt-0.5">
                    {userInfo?.role?.value ||
                      (language === "bn" ? "এজেন্ট" : "Agent")}
                  </span>
                </div>
              </div>
            )}
            <Button
              icon={<LogoutOutlined />}
              type="text"
              className="text-gray-600 hover:text-[#1E40AF]"
              onClick={handleLogout}
            />
          </div>
        </Header>

        <Content className="m-4 lg:m-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
