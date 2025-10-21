"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  Tag,
  Image,
  Space,
  Row,
  Col,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Statistic,
  Dropdown,
  Menu,
  Empty,
  Spin,
  Tabs,
  Switch,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  EyeOutlined,
  DownOutlined,
  ReloadOutlined,
  HomeOutlined,
  DollarOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import bnBD from "antd/locale/bn_BD";
import enUS from "antd/locale/en_US";

const { Option } = Select;
const { TabPane } = Tabs;

// Bilingual Content
const translations = {
  en: {
    // Header
    title: "Property Management",
    subtitle: "Manage your apartment portfolio efficiently",
    addProperty: "Add New Property",

    // Statistics
    totalProperties: "Total Properties",
    portfolioValue: "Portfolio Value",
    totalInvestment: "Total Investment",
    totalProfit: "Total Profit",

    // Filters
    searchPlaceholder: "Search by apartment, project, building, location...",
    filterLocation: "Filter by Location",
    filterBuilding: "Filter by Building",
    clear: "Clear",
    refresh: "Refresh",

    // Table
    apartmentInfo: "Apartment Info",
    buildingLocation: "Building & Location",
    financialInfo: "Financial Info",
    images: "Images",
    status: "Status",
    createdDate: "Created Date",
    actions: "Actions",
    sell: "Sell",
    buy: "Buy",
    profit: "Profit",
    noImages: "No Images",

    // Status
    available: "Available",
    sold: "Sold",

    // Modal
    editProperty: "Edit Property",
    addNewProperty: "Add New Property",
    apartmentNumber: "Apartment Number",
    projectName: "Project Name",
    buildingName: "Building Name/Number",
    location: "Location",
    buyingPrice: "Buying Price (BDT)",
    sellingPrice: "Selling Price (BDT)",
    apartmentImages: "Apartment Images",
    uploadText: "Upload",
    uploadHint: "Upload up to 8 images of the apartment (Required)",
    cancel: "Cancel",
    updateProperty: "Update Property",
    addPropertyBtn: "Add Property",

    // Actions
    editPropertyAction: "Edit Property",
    viewImages: "View Images",
    deleteProperty: "Delete Property",
    deleteConfirm: "Are you sure you want to delete this property?",

    // Messages
    propertyAdded: "Property added successfully!",
    propertyUpdated: "Property updated successfully!",
    propertyDeleted: "Property deleted successfully!",
    fetchError: "Failed to fetch properties",
    saveError: "Failed to save property. Please try again.",
    deleteError: "Failed to delete property",
    loading: "Loading properties...",
    noProperties: "No properties found",
    noPropertiesSearch: "No properties found matching your search criteria",
    addFirstProperty: "Add Your First Property",

    // Validation
    requiredApartment: "Apartment number is required",
    requiredProject: "Project name is required",
    requiredBuilding: "Building name is required",
    requiredLocation: "Location is required",
    requiredBuyingPrice: "Buying price is required",
    requiredSellingPrice: "Selling price is required",
    minImages: "At least one image is required",

    // Examples
    exampleApartment: "e.g., A-101, B-205",
    exampleProject: "e.g., Sky Garden, Lake View",
    exampleBuilding: "e.g., Tower A, Building B",
    exampleLocation: "e.g., Gulshan, Banani, Dhanmondi",
  },
  bn: {
    // Header
    title: "প্রপার্টি ম্যানেজমেন্ট",
    subtitle: "আপনার অ্যাপার্টমেন্ট পোর্টফোলিও দক্ষতার সাথে পরিচালনা করুন",
    addProperty: "নতুন প্রপার্টি যোগ করুন",

    // Statistics
    totalProperties: "মোট প্রপার্টি",
    portfolioValue: "পোর্টফোলিও মান",
    totalInvestment: "মোট বিনিয়োগ",
    totalProfit: "মোট লাভ",

    // Filters
    searchPlaceholder:
      "অ্যাপার্টমেন্ট, প্রজেক্ট, বিল্ডিং, লোকেশন দ্বারা খুঁজুন...",
    filterLocation: "লোকেশন দ্বারা ফিল্টার করুন",
    filterBuilding: "বিল্ডিং দ্বারা ফিল্টার করুন",
    clear: "ক্লিয়ার",
    refresh: "রিফ্রেশ",

    // Table
    apartmentInfo: "অ্যাপার্টমেন্ট তথ্য",
    buildingLocation: "বিল্ডিং ও লোকেশন",
    financialInfo: "আর্থিক তথ্য",
    images: "ছবি",
    status: "স্ট্যাটাস",
    createdDate: "তৈরির তারিখ",
    actions: "কর্ম",
    sell: "বিক্রয়",
    buy: "ক্রয়",
    profit: "লাভ",
    noImages: "কোন ছবি নেই",

    // Status
    available: "উপলব্ধ",
    sold: "বিক্রিত",

    // Modal
    editProperty: "প্রপার্টি সম্পাদনা করুন",
    addNewProperty: "নতুন প্রপার্টি যোগ করুন",
    apartmentNumber: "অ্যাপার্টমেন্ট নম্বর",
    projectName: "প্রজেক্টের নাম",
    buildingName: "বিল্ডিং নাম/নম্বর",
    location: "লোকেশন",
    buyingPrice: "ক্রয় মূল্য (BDT)",
    sellingPrice: "বিক্রয় মূল্য (BDT)",
    apartmentImages: "অ্যাপার্টমেন্টের ছবি",
    uploadText: "আপলোড",
    uploadHint: "অ্যাপার্টমেন্টের সর্বোচ্চ ৮টি ছবি আপলোড করুন (আবশ্যক)",
    cancel: "বাতিল",
    updateProperty: "প্রপার্টি আপডেট করুন",
    addPropertyBtn: "প্রপার্টি যোগ করুন",

    // Actions
    editPropertyAction: "প্রপার্টি সম্পাদনা",
    viewImages: "ছবি দেখুন",
    deleteProperty: "প্রপার্টি মুছুন",
    deleteConfirm: "আপনি কি নিশ্চিত যে এই প্রপার্টিটি মুছতে চান?",

    // Messages
    propertyAdded: "প্রপার্টি সফলভাবে যোগ করা হয়েছে!",
    propertyUpdated: "প্রপার্টি সফলভাবে আপডেট করা হয়েছে!",
    propertyDeleted: "প্রপার্টি সফলভাবে মুছে ফেলা হয়েছে!",
    fetchError: "প্রপার্টি লোড করতে ব্যর্থ হয়েছে",
    saveError:
      "প্রপার্টি সংরক্ষণ করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    deleteError: "প্রপার্টি মুছতে ব্যর্থ হয়েছে",
    loading: "প্রপার্টি লোড হচ্ছে...",
    noProperties: "কোন প্রপার্টি পাওয়া যায়নি",
    noPropertiesSearch: "আপনার খোঁজার শর্তানুযায়ী কোন প্রপার্টি পাওয়া যায়নি",
    addFirstProperty: "আপনার প্রথম প্রপার্টি যোগ করুন",

    // Validation
    requiredApartment: "অ্যাপার্টমেন্ট নম্বর আবশ্যক",
    requiredProject: "প্রজেক্টের নাম আবশ্যক",
    requiredBuilding: "বিল্ডিং নাম আবশ্যক",
    requiredLocation: "লোকেশন আবশ্যক",
    requiredBuyingPrice: "ক্রয় মূল্য আবশ্যক",
    requiredSellingPrice: "বিক্রয় মূল্য আবশ্যক",
    minImages: "কমপক্ষে একটি ছবি আবশ্যক",

    // Examples
    exampleApartment: "যেমন, A-101, B-205",
    exampleProject: "যেমন, স্কাই গার্ডেন, লেক ভিউ",
    exampleBuilding: "যেমন, টাওয়ার A, বিল্ডিং B",
    exampleLocation: "যেমন, গুলশান, বনানী, ধানমন্ডি",
  },
};

// Validation Schema
const propertyValidationSchema = Yup.object({
  apartmentNumber: Yup.string().required("requiredApartment"),
  projectName: Yup.string().required("requiredProject"),
  buildingName: Yup.string().required("requiredBuilding"),
  location: Yup.string().required("requiredLocation"),
  sellingPrice: Yup.number()
    .required("requiredSellingPrice")
    .min(0, "Selling price must be positive"),
  buyingPrice: Yup.number()
    .required("requiredBuyingPrice")
    .min(0, "Buying price must be positive"),
  apartmentImages: Yup.array().min(1, "minImages"),
});

const PropertyAddition = () => {
  // State Management
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState(null);
  const [buildingFilter, setBuildingFilter] = useState(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("list");
  const [language, setLanguage] = useState("bn"); // 'en' or 'bn'

  // Get translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Mock API calls
  const mockApi = {
    getProperties: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                apartmentNumber: "A-101",
                projectName: "Sky Garden",
                buildingName: "Tower A",
                location: "Gulshan",
                sellingPrice: 25000000,
                buyingPrice: 18000000,
                apartmentImages: [
                  {
                    uid: "1",
                    name: "image1.jpg",
                    url: "https://via.placeholder.com/400x300/007ACC/FFFFFF?text=Apartment+A-101",
                  },
                  {
                    uid: "2",
                    name: "image2.jpg",
                    url: "https://via.placeholder.com/400x300/00A98F/FFFFFF?text=Living+Room",
                  },
                ],
                createdAt: "2024-01-15",
                status: "available",
              },
              {
                id: 2,
                apartmentNumber: "B-205",
                projectName: "Lake View",
                buildingName: "Tower B",
                location: "Banani",
                sellingPrice: 32000000,
                buyingPrice: 25000000,
                apartmentImages: [
                  {
                    uid: "1",
                    name: "image1.jpg",
                    url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Apartment+B-205",
                  },
                ],
                createdAt: "2024-01-10",
                status: "sold",
              },
            ],
          });
        }, 1000);
      });
    },

    createProperty: async (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              ...data,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            },
          });
        }, 500);
      });
    },

    updateProperty: async (id, data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { ...data, id } });
        }, 500);
      });
    },

    deleteProperty: async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
  };

  // Formik for property form
  const formik = useFormik({
    initialValues: {
      apartmentNumber: "",
      projectName: "",
      buildingName: "",
      location: "",
      sellingPrice: 0,
      buyingPrice: 0,
      apartmentImages: [],
      status: "available",
    },
    validationSchema: propertyValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        let response;
        if (editingProperty) {
          response = await mockApi.updateProperty(editingProperty.id, values);
          message.success(t("propertyUpdated"));
        } else {
          response = await mockApi.createProperty(values);
          message.success(t("propertyAdded"));
        }

        if (editingProperty) {
          setProperties((prev) =>
            prev.map((prop) =>
              prop.id === editingProperty.id ? response.data : prop
            )
          );
        } else {
          setProperties((prev) => [...prev, response.data]);
        }

        resetForm();
        setModalVisible(false);
        setEditingProperty(null);
      } catch (error) {
        message.error(t("saveError"));
        console.error("Save property error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter properties when search or filters change
  useEffect(() => {
    filterProperties();
  }, [properties, searchText, locationFilter, buildingFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getProperties();
      setProperties(response.data);
    } catch (error) {
      message.error(t("fetchError"));
      console.error("Fetch properties error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.apartmentNumber.toLowerCase().includes(searchLower) ||
          property.projectName.toLowerCase().includes(searchLower) ||
          property.buildingName.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower)
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (property) =>
          property.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    if (buildingFilter) {
      filtered = filtered.filter(
        (property) =>
          property.buildingName.toLowerCase() === buildingFilter.toLowerCase()
      );
    }

    setFilteredProperties(filtered);
  };

  // Unique locations and buildings for filters
  const uniqueLocations = useMemo(
    () => [...new Set(properties.map((prop) => prop.location).filter(Boolean))],
    [properties]
  );

  const uniqueBuildings = useMemo(
    () => [
      ...new Set(properties.map((prop) => prop.buildingName).filter(Boolean)),
    ],
    [properties]
  );

  // Handlers
  const handleAddProperty = () => {
    formik.resetForm();
    setEditingProperty(null);
    setModalVisible(true);
  };

  const handleEditProperty = (property) => {
    formik.setValues({
      apartmentNumber: property.apartmentNumber,
      projectName: property.projectName,
      buildingName: property.buildingName,
      location: property.location,
      sellingPrice: property.sellingPrice,
      buyingPrice: property.buyingPrice,
      apartmentImages: property.apartmentImages || [],
      status: property.status || "available",
    });
    setEditingProperty(property);
    setModalVisible(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      setLoading(true);
      await mockApi.deleteProperty(propertyId);
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      message.success(t("propertyDeleted"));
    } catch (error) {
      message.error(t("deleteError"));
      console.error("Delete property error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = (images, startIndex = 0) => {
    setPreviewImages(images.map((img) => img.url || img.thumbUrl));
    setImagePreviewVisible(true);
  };

  const clearFilters = () => {
    setSearchText("");
    setLocationFilter(null);
    setBuildingFilter(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  };

  // Statistics
  const statistics = useMemo(() => {
    const totalProperties = properties.length;
    const totalValue = properties.reduce(
      (sum, prop) => sum + prop.sellingPrice,
      0
    );
    const totalInvestment = properties.reduce(
      (sum, prop) => sum + prop.buyingPrice,
      0
    );
    const totalProfit = properties.reduce(
      (sum, prop) => sum + (prop.sellingPrice - prop.buyingPrice),
      0
    );
    const availableProperties = properties.filter(
      (prop) => prop.status === "available"
    ).length;

    return {
      totalProperties,
      totalValue,
      totalInvestment,
      totalProfit,
      availableProperties,
    };
  }, [properties]);

  // Columns definition
  const columns = [
    {
      title: t("apartmentInfo"),
      dataIndex: "apartmentNumber",
      key: "apartmentNumber",
      width: 150,
      fixed: "left",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.projectName}
          </div>
        </div>
      ),
    },
    {
      title: t("buildingLocation"),
      key: "buildingLocation",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.buildingName}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <EnvironmentOutlined /> {record.location}
          </div>
        </div>
      ),
    },
    {
      title: t("financialInfo"),
      key: "financial",
      width: 200,
      render: (_, record) => {
        const profit = record.sellingPrice - record.buyingPrice;
        const profitPercentage = ((profit / record.buyingPrice) * 100).toFixed(
          1
        );

        return (
          <div>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: "#52c41a" }}>
                {t("sell")}: ৳{(record.sellingPrice / 1000000).toFixed(1)}M
              </span>
            </div>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: "#1890ff" }}>
                {t("buy")}: ৳{(record.buyingPrice / 1000000).toFixed(1)}M
              </span>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: profit >= 0 ? "#52c41a" : "#ff4d4f",
              }}
            >
              {t("profit")}: ৳{(profit / 1000000).toFixed(1)}M (
              {profitPercentage}%)
            </div>
          </div>
        );
      },
    },
    {
      title: t("images"),
      dataIndex: "apartmentImages",
      key: "apartmentImages",
      width: 100,
      render: (images, record) => (
        <Tooltip
          title={
            language === "en" ? "Click to view images" : "ছবি দেখতে ক্লিক করুন"
          }
        >
          <div
            onClick={() => handleImagePreview(images || [])}
            style={{ cursor: "pointer" }}
          >
            {images && images.length > 0 ? (
              <Space>
                <Image
                  src={images[0].url || images[0].thumbUrl}
                  alt="Apartment"
                  width={40}
                  height={40}
                  style={{ borderRadius: "4px", objectFit: "cover" }}
                  preview={false}
                />
                {images.length > 1 && (
                  <Tag color="blue">+{images.length - 1}</Tag>
                )}
              </Space>
            ) : (
              <Tag icon={<PictureOutlined />} color="default">
                {t("noImages")}
              </Tag>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag
          color={
            status === "available"
              ? "green"
              : status === "sold"
              ? "red"
              : "orange"
          }
          style={{ fontWeight: 500 }}
        >
          {t(status)}
        </Tag>
      ),
    },
    {
      title: t("createdDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditProperty(record)}
              >
                {t("editPropertyAction")}
              </Menu.Item>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => handleImagePreview(record.apartmentImages || [])}
              >
                {t("viewImages")}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                <Popconfirm
                  title={t("deleteConfirm")}
                  onConfirm={() => handleDeleteProperty(record.id)}
                  okText={language === "en" ? "Yes" : "হ্যাঁ"}
                  cancelText={language === "en" ? "No" : "না"}
                  placement="left"
                >
                  {t("deleteProperty")}
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button type="text" icon={<DownOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const currentLocale = language === "bn" ? bnBD : enUS;

  return (
    <ConfigProvider
      locale={currentLocale}
      direction={language === "ar" ? "rtl" : "ltr"}
    >
      <div
        style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {/* <h1
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1f1f1f",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <HomeOutlined />
                    {t("title")}
                  </h1> */}
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#666",
                      fontSize: "16px",
                    }}
                  >
                    {t("subtitle")}
                  </p>
                </div>

                <Space>
                  {/* Language Toggle */}
                  <Tooltip title={language === "en" ? "বাংলা" : "English"}>
                    <Button
                      type="text"
                      icon={<GlobalOutlined />}
                      onClick={toggleLanguage}
                      style={{
                        border: "1px solid #d9d9d9",
                        fontWeight: 600,
                        color: language === "bn" ? "#1890ff" : "#52c41a",
                      }}
                    >
                      {language === "en" ? "বাংলা" : "EN"}
                    </Button>
                  </Tooltip>

                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleAddProperty}
                    style={{
                      height: "auto",
                      padding: "8px 16px",
                      fontWeight: 600,
                    }}
                  >
                    {t("addProperty")}
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("totalProperties")}
                  value={statistics.totalProperties}
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("portfolioValue")}
                  value={statistics.totalValue / 1000000}
                  precision={1}
                  suffix="M BDT"
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("totalInvestment")}
                  value={statistics.totalInvestment / 1000000}
                  precision={1}
                  suffix="M BDT"
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("totalProfit")}
                  value={statistics.totalProfit / 1000000}
                  precision={1}
                  suffix="M BDT"
                  prefix={<DollarOutlined />}
                  valueStyle={{
                    color: statistics.totalProfit >= 0 ? "#52c41a" : "#ff4d4f",
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content Card */}
          <Card
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarStyle={{ padding: "0 24px", margin: 0 }}
            >
              <TabPane
                tab={language === "en" ? "Property List" : "প্রপার্টি তালিকা"}
                key="list"
              >
                {/* Filters Section */}
                <div style={{ padding: "24px 24px 16px 24px" }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={8}>
                      <Input.Search
                        placeholder={t("searchPlaceholder")}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                      />
                    </Col>

                    <Col xs={12} md={6}>
                      <Select
                        style={{ width: "100%" }}
                        placeholder={t("filterLocation")}
                        value={locationFilter}
                        onChange={setLocationFilter}
                        suffixIcon={<FilterOutlined />}
                        size="large"
                        allowClear
                      >
                        {uniqueLocations.map((location) => (
                          <Option key={location} value={location}>
                            {location}
                          </Option>
                        ))}
                      </Select>
                    </Col>

                    <Col xs={12} md={6}>
                      <Select
                        style={{ width: "100%" }}
                        placeholder={t("filterBuilding")}
                        value={buildingFilter}
                        onChange={setBuildingFilter}
                        suffixIcon={<FilterOutlined />}
                        size="large"
                        allowClear
                      >
                        {uniqueBuildings.map((building) => (
                          <Option key={building} value={building}>
                            {building}
                          </Option>
                        ))}
                      </Select>
                    </Col>

                    <Col xs={24} md={4}>
                      <Space
                        style={{ width: "100%", justifyContent: "flex-end" }}
                      >
                        <Button onClick={clearFilters} size="large">
                          {t("clear")}
                        </Button>
                        <Button
                          onClick={fetchProperties}
                          icon={<ReloadOutlined />}
                          size="large"
                          loading={loading}
                        >
                          {t("refresh")}
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: 0 }} />

                {/* Properties Table */}
                <div style={{ padding: "0 24px 24px 24px" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <Spin size="large" />
                      <div style={{ marginTop: 16, color: "#666" }}>
                        {t("loading")}
                      </div>
                    </div>
                  ) : filteredProperties.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={filteredProperties}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} ${
                            language === "en" ? "properties" : "প্রপার্টি"
                          }`,
                      }}
                      scroll={{ x: 1000 }}
                      size="middle"
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>
                          {searchText || locationFilter || buildingFilter
                            ? t("noPropertiesSearch")
                            : t("noProperties")}
                        </span>
                      }
                    >
                      <Button type="primary" onClick={handleAddProperty}>
                        {t("addFirstProperty")}
                      </Button>
                    </Empty>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Card>

          {/* Add/Edit Property Modal */}
          <Modal
            title={
              <span style={{ fontSize: "20px", fontWeight: 600 }}>
                {editingProperty ? t("editProperty") : t("addNewProperty")}
              </span>
            }
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              formik.resetForm();
              setEditingProperty(null);
            }}
            footer={null}
            width={700}
            style={{ top: 20 }}
            destroyOnClose
          >
            <Form layout="vertical" onFinish={formik.handleSubmit}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("apartmentNumber")}
                    required
                    validateStatus={
                      formik.errors.apartmentNumber ? "error" : ""
                    }
                    help={
                      formik.errors.apartmentNumber
                        ? t(formik.errors.apartmentNumber)
                        : ""
                    }
                  >
                    <Input
                      name="apartmentNumber"
                      value={formik.values.apartmentNumber}
                      onChange={formik.handleChange}
                      placeholder={t("exampleApartment")}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("projectName")}
                    required
                    validateStatus={formik.errors.projectName ? "error" : ""}
                    help={
                      formik.errors.projectName
                        ? t(formik.errors.projectName)
                        : ""
                    }
                  >
                    <Input
                      name="projectName"
                      value={formik.values.projectName}
                      onChange={formik.handleChange}
                      placeholder={t("exampleProject")}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("buildingName")}
                    required
                    validateStatus={formik.errors.buildingName ? "error" : ""}
                    help={
                      formik.errors.buildingName
                        ? t(formik.errors.buildingName)
                        : ""
                    }
                  >
                    <Input
                      name="buildingName"
                      value={formik.values.buildingName}
                      onChange={formik.handleChange}
                      placeholder={t("exampleBuilding")}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("location")}
                    required
                    validateStatus={formik.errors.location ? "error" : ""}
                    help={
                      formik.errors.location ? t(formik.errors.location) : ""
                    }
                  >
                    <Input
                      name="location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      placeholder={t("exampleLocation")}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("buyingPrice")}
                    required
                    validateStatus={formik.errors.buyingPrice ? "error" : ""}
                    help={
                      formik.errors.buyingPrice
                        ? t(formik.errors.buyingPrice)
                        : ""
                    }
                  >
                    <InputNumber
                      name="buyingPrice"
                      value={formik.values.buyingPrice}
                      onChange={(value) =>
                        formik.setFieldValue("buyingPrice", value)
                      }
                      style={{ width: "100%" }}
                      min={0}
                      formatter={(value) =>
                        `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                      size="large"
                      placeholder={t("buyingPrice")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("sellingPrice")}
                    required
                    validateStatus={formik.errors.sellingPrice ? "error" : ""}
                    help={
                      formik.errors.sellingPrice
                        ? t(formik.errors.sellingPrice)
                        : ""
                    }
                  >
                    <InputNumber
                      name="sellingPrice"
                      value={formik.values.sellingPrice}
                      onChange={(value) =>
                        formik.setFieldValue("sellingPrice", value)
                      }
                      style={{ width: "100%" }}
                      min={0}
                      formatter={(value) =>
                        `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                      size="large"
                      placeholder={t("sellingPrice")}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={t("apartmentImages")}
                required
                validateStatus={formik.errors.apartmentImages ? "error" : ""}
                help={
                  formik.errors.apartmentImages
                    ? t(formik.errors.apartmentImages)
                    : ""
                }
              >
                <Upload
                  multiple
                  listType="picture-card"
                  fileList={formik.values.apartmentImages}
                  beforeUpload={(file) => {
                    formik.setFieldValue("apartmentImages", [
                      ...formik.values.apartmentImages,
                      { ...file, url: URL.createObjectURL(file) },
                    ]);
                    return false;
                  }}
                  onRemove={(file) => {
                    const newFiles = formik.values.apartmentImages.filter(
                      (f) => f.uid !== file.uid
                    );
                    formik.setFieldValue("apartmentImages", newFiles);
                  }}
                  onPreview={(file) => {
                    setPreviewImages([file.url || file.thumbUrl]);
                    setImagePreviewVisible(true);
                  }}
                >
                  {formik.values.apartmentImages.length >= 8 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t("uploadText")}</div>
                    </div>
                  )}
                </Upload>
                <div style={{ color: "#666", fontSize: "12px", marginTop: 8 }}>
                  {t("uploadHint")}
                </div>
              </Form.Item>

              <Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      formik.resetForm();
                      setEditingProperty(null);
                    }}
                    size="large"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    disabled={!formik.isValid}
                  >
                    {editingProperty
                      ? t("updateProperty")
                      : t("addPropertyBtn")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Image Preview Modal */}
          <Modal
            open={imagePreviewVisible}
            footer={null}
            onCancel={() => setImagePreviewVisible(false)}
            width="80vw"
            style={{ top: 20 }}
          >
            <Image.PreviewGroup items={previewImages}>
              <Image src={previewImages[0]} />
            </Image.PreviewGroup>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PropertyAddition;
