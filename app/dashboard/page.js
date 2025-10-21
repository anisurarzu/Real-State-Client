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
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import coreAxios from "@/utils/axiosInstance";
import PropertyAddition from "@/component/PropertyAddition";
import AccountsManagement from "@/component/AccountsManagement";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const rolePermissions = {
  superadmin: [
    { key: "1", label: "ড্যাশবোর্ড", icon: <DashboardOutlined /> },
    { key: "2", label: "প্রোপার্টি লিস্টিং", icon: <HomeOutlined /> },
    { key: "3", label: "ক্লায়েন্ট ম্যানেজমেন্ট", icon: <UserOutlined /> },
    { key: "4", label: "অ্যাপয়েন্টমেন্ট", icon: <CalendarOutlined /> },
  ],
  agent: [
    { key: "1", label: "ড্যাশবোর্ড", icon: <DashboardOutlined /> },
    { key: "2", label: "প্রোপার্টি লিস্টিং", icon: <HomeOutlined /> },
    { key: "3", label: "ক্লায়েন্ট ম্যানেজমেন্ট", icon: <UserOutlined /> },
    { key: "4", label: "অ্যাপয়েন্টমেন্ট", icon: <CalendarOutlined /> },
  ],
  support: [
    { key: "1", label: "ড্যাশবোর্ড", icon: <DashboardOutlined /> },
    { key: "2", label: "প্রোপার্টি লিস্টিং", icon: <HomeOutlined /> },
  ],
};

// Real Estate Dashboard Content Component
const DashboardContent = ({ userInfo }) => {
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
          { name: "গুলশান পেন্টহাউস", price: "4.5Cr", views: 156, trend: "up" },
          {
            name: "বনানী লাক্সারী ফ্ল্যাট",
            price: "2.8Cr",
            views: 134,
            trend: "up",
          },
          {
            name: "বারিধারা ডুপ্লেক্স",
            price: "3.2Cr",
            views: 98,
            trend: "stable",
          },
          {
            name: "উত্তরা লেকসাইড হাউস",
            price: "1.9Cr",
            views: 87,
            trend: "up",
          },
        ],
        recentAppointments: [
          {
            client: "আহমেদ হাসান",
            property: "গুলশান পেন্টহাউস",
            date: "১৫/১২/২০২৪",
            time: "০৩:০০ PM",
            status: "Confirmed",
            priority: "high",
          },
          {
            client: "ফারহানা ইসলাম",
            property: "বনানী আপার্টমেন্ট",
            date: "১৪/১২/২০২৪",
            time: "১১:০০ AM",
            status: "Pending",
            priority: "medium",
          },
          {
            client: "রাজীব আহমেদ",
            property: "ধানমন্ডি ফ্ল্যাট",
            date: "১৩/১২/২০২৪",
            time: "০৪:৩০ PM",
            status: "Completed",
            priority: "low",
          },
          {
            client: "নুসরাত জাহান",
            property: "বারিধারা ভিলা",
            date: "১২/১২/২০২৪",
            time: "০২:১৫ PM",
            status: "Confirmed",
            priority: "high",
          },
        ],
        propertyTypes: [
          { name: "আপার্টমেন্ট", count: 67, color: "#3B82F6" },
          { name: "বাড়ি/ভিলা", count: 45, color: "#10B981" },
          { name: "প্লট", count: 28, color: "#8B5CF6" },
          { name: "কমার্শিয়াল", count: 16, color: "#F59E0B" },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
    message.success("ডেটা রিফ্রেশ করা হয়েছে!");
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
            আপনার রিয়েল এস্টেট পারফরম্যান্স সারাংশ
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={refreshData}
          className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-10 px-6"
        >
          রিফ্রেশ ডেটা
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
                  মোট প্রোপার্টি
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.totalProperties}
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  সকল প্রোপার্টি
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <HomeOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +12% এই মাসে
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
                  মাসিক আয়
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {(dashboardData.monthlyRevenue / 10000000).toFixed(1)}Cr
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  মাসিক রাজস্ব
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarCircleOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +23% গত মাস থেকে
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
                  সক্রিয় ক্লায়েন্ট
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.totalClients}
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  মোট ক্লায়েন্ট
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserOutlined className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <ArrowUpOutlined className="text-green-300 mr-1" />
              <span className="text-green-300 text-sm font-medium">
                +8% নতুন ক্লায়েন্ট
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
                  পারফরম্যান্স
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {dashboardData.performance}%
                </div>
                <div className="text-white text-opacity-90 text-xs">
                  সাফল্যের হার
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
                  বিক্রিত প্রোপার্টি
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.soldProperties}
                </div>
                <div className="text-gray-500 text-xs">এই মাসে</div>
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
                  উপলব্ধ প্রোপার্টি
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.availableProperties}
                </div>
                <div className="text-gray-500 text-xs">বর্তমানে লিস্টেড</div>
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
                  মুলতুবি অ্যাপয়েন্টমেন্ট
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData.pendingAppointments}
                </div>
                <div className="text-gray-500 text-xs">নিশ্চিত করার জন্য</div>
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
                  ট্রেন্ডিং প্রোপার্টি
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
                {dashboardData.trendingProperties.length} প্রোপার্টি
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
                          {item.price} • {item.views} ভিউ
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
                      {item.trend === "up" ? "ট্রেন্ডিং" : "স্টেবল"}
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
                  সাম্প্রতিক অ্যাপয়েন্টমেন্ট
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
                {dashboardData.recentAppointments.length} অ্যাপয়েন্টমেন্ট
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
                      {item.status}
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
                  প্রোপার্টি টাইপ অনুযায়ী
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
                    <span className="text-sm text-gray-500">প্রোপার্টি</span>
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
                  দ্রুত কর্ম
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
                onClick={() =>
                  message.info("নতুন প্রোপার্টি যোগ করার ফিচার শীঘ্রই আসছে")
                }
              >
                নতুন প্রোপার্টি যোগ করুন
              </Button>
              <Button
                icon={<CalendarOutlined />}
                className="h-12 text-lg border-green-500 text-green-500 hover:bg-green-50 transition-all duration-300"
                onClick={() =>
                  message.info("অ্যাপয়েন্টমেন্ট শিডিউল ফিচার শীঘ্রই আসছে")
                }
              >
                অ্যাপয়েন্টমেন্ট শিডিউল
              </Button>
              <Button
                icon={<UserOutlined />}
                className="h-12 text-lg border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-300"
                onClick={() =>
                  message.info("ক্লায়েন্ট ব্যবস্থাপনা ফিচার শীঘ্রই আসছে")
                }
              >
                ক্লায়েন্ট ব্যবস্থাপনা
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Simple placeholder components for other menu items
const PropertyListings = () => (
  <Card className="border-0 shadow-2xl rounded-2xl">
    <div className="text-center py-8">
      <HomeOutlined className="text-6xl text-blue-500 mb-4" />
      <Title level={3} className="text-gray-800">
        প্রোপার্টি লিস্টিং
      </Title>
      <Text className="text-gray-600 text-lg">
        প্রোপার্টি লিস্টিং ব্যবস্থাপনা শীঘ্রই আসছে...
      </Text>
    </div>
  </Card>
);

const ClientManagement = () => (
  <Card className="border-0 shadow-2xl rounded-2xl">
    <div className="text-center py-8">
      <UserOutlined className="text-6xl text-green-500 mb-4" />
      <Title level={3} className="text-gray-800">
        ক্লায়েন্ট ম্যানেজমেন্ট
      </Title>
      <Text className="text-gray-600 text-lg">
        ক্লায়েন্ট ব্যবস্থাপনা শীঘ্রই আসছে...
      </Text>
    </div>
  </Card>
);

const AppointmentManagement = () => (
  <Card className="border-0 shadow-2xl rounded-2xl">
    <div className="text-center py-8">
      <CalendarOutlined className="text-6xl text-orange-500 mb-4" />
      <Title level={3} className="text-gray-800">
        অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা
      </Title>
      <Text className="text-gray-600 text-lg">
        অ্যাপয়েন্টমেন্ট শিডিউলিং শীঘ্রই আসছে...
      </Text>
    </div>
  </Card>
);

const Dashboard = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

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
        return <DashboardContent userInfo={userInfo} />;
      case "2":
        return <PropertyAddition />;
      case "3":
        return <AccountsManagement />;
      case "4":
        return <AppointmentManagement />;
      default:
        return <div>অনুমতি নেই</div>;
    }
  };

  const renderMenuItems = () => {
    if (!userInfo) return null;

    const userRole = userInfo?.role?.value || "agent";
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
                  rolePermissions[userInfo?.role?.value || "agent"]?.find(
                    (item) => item.key === selectedMenu
                  )?.label
                }
              </Title>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
                    {userInfo?.role?.value || "এজেন্ট"}
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
