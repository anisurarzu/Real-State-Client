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
  Select,
  Tag,
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
  DatePicker,
  Image,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalculatorOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  GlobalOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import bnBD from "antd/locale/bn_BD";
import enUS from "antd/locale/en_US";

const { Option } = Select;
const { TabPane } = Tabs;

// Extend Day.js with UTC and Timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Bilingual Content
const translations = {
  en: {
    // Header
    title: "Accounts Management",
    subtitle: "Track apartment sales, expenses, and net profits",
    addTransaction: "Add Transaction",

    // Statistics
    totalSales: "Total Sales",
    totalExpenses: "Total Expenses",
    totalProfit: "Total Profit",
    totalTransactions: "Total Transactions",

    // Filters
    searchPlaceholder: "Search by flat, building, location, buyer...",
    filterLocation: "Filter by Location",
    filterBuilding: "Filter by Building",
    filterFlat: "Filter by Flat Number",
    clear: "Clear",
    refresh: "Refresh",

    // Table
    flatNumber: "Flat Number",
    buildingLocation: "Building & Location",
    financialDetails: "Financial Details",
    dates: "Dates",
    status: "Status",
    actions: "Actions",
    soldPrice: "Sold Price",
    deposit: "Deposit",
    ownerPayment: "Owner Payment",
    expenses: "Expenses",
    netProfit: "Net Profit",

    // Status
    booked: "Booked",
    sold: "Sold",
    cancelled: "Cancelled",

    // Modal
    editTransaction: "Edit Transaction",
    addTransaction: "Add Transaction",
    basicInfo: "Basic Information",
    financialInfo: "Financial Information",
    datesInfo: "Date Information",
    flatNumber: "Flat Number",
    projectName: "Project Name",
    buildingName: "Building Name",
    location: "Location",
    buyerName: "Buyer Name",
    buyerPhone: "Buyer Phone",
    buyerEmail: "Buyer Email",
    soldPrice: "Sold Price (BDT)",
    depositAmount: "Deposit Amount (BDT)",
    ownerPayment: "Owner Payment (BDT)",
    otherExpenses: "Other Expenses (BDT)",
    bookingDate: "Booking Date & Time",
    soldDate: "Sold Date & Time",
    notes: "Notes",
    cancel: "Cancel",
    updateTransaction: "Update Transaction",
    addTransactionBtn: "Add Transaction",

    // Actions
    editTransactionAction: "Edit Transaction",
    viewDetails: "View Details",
    deleteTransaction: "Delete Transaction",
    deleteConfirm: "Are you sure you want to delete this transaction?",

    // Messages
    transactionAdded: "Transaction added successfully!",
    transactionUpdated: "Transaction updated successfully!",
    transactionDeleted: "Transaction deleted successfully!",
    fetchError: "Failed to fetch transactions",
    saveError: "Failed to save transaction. Please try again.",
    deleteError: "Failed to delete transaction",
    loading: "Loading transactions...",
    noTransactions: "No transactions found",
    noTransactionsSearch: "No transactions found matching your search criteria",
    addFirstTransaction: "Add Your First Transaction",

    // Validation
    requiredFlat: "Flat number is required",
    requiredProject: "Project name is required",
    requiredBuilding: "Building name is required",
    requiredLocation: "Location is required",
    requiredBuyer: "Buyer name is required",
    requiredSoldPrice: "Sold price is required",
    requiredDeposit: "Deposit amount is required",
    requiredOwnerPayment: "Owner payment is required",
    requiredBookingDate: "Booking date is required",

    // Examples
    exampleFlat: "e.g., A-101, B-205",
    exampleProject: "e.g., Sky Garden, Lake View",
    exampleBuilding: "e.g., Tower A, Building B",
    exampleLocation: "e.g., Gulshan, Banani, Dhanmondi",
  },
  bn: {
    // Header
    title: "অ্যাকাউন্টস ম্যানেজমেন্ট",
    subtitle: "অ্যাপার্টমেন্ট বিক্রয়, ব্যয় এবং নেট লাভ ট্র্যাক করুন",
    addTransaction: "লেনদেন যোগ করুন",

    // Statistics
    totalSales: "মোট বিক্রয়",
    totalExpenses: "মোট ব্যয়",
    totalProfit: "মোট লাভ",
    totalTransactions: "মোট লেনদেন",

    // Filters
    searchPlaceholder: "ফ্ল্যাট, বিল্ডিং, লোকেশন, ক্রেতা দ্বারা খুঁজুন...",
    filterLocation: "লোকেশন দ্বারা ফিল্টার করুন",
    filterBuilding: "বিল্ডিং দ্বারা ফিল্টার করুন",
    filterFlat: "ফ্ল্যাট নম্বর দ্বারা ফিল্টার করুন",
    clear: "ক্লিয়ার",
    refresh: "রিফ্রেশ",

    // Table
    flatNumber: "ফ্ল্যাট নম্বর",
    buildingLocation: "বিল্ডিং ও লোকেশন",
    financialDetails: "আর্থিক বিবরণ",
    dates: "তারিখসমূহ",
    status: "স্ট্যাটাস",
    actions: "কর্ম",
    soldPrice: "বিক্রয় মূল্য",
    deposit: "ডিপোজিট",
    ownerPayment: "মালিকের পেমেন্ট",
    expenses: "ব্যয়",
    netProfit: "নেট লাভ",

    // Status
    booked: "বুকড",
    sold: "বিক্রিত",
    cancelled: "বাতিল",

    // Modal
    editTransaction: "লেনদেন সম্পাদনা করুন",
    addTransaction: "লেনদেন যোগ করুন",
    basicInfo: "মৌলিক তথ্য",
    financialInfo: "আর্থিক তথ্য",
    datesInfo: "তারিখের তথ্য",
    flatNumber: "ফ্ল্যাট নম্বর",
    projectName: "প্রজেক্টের নাম",
    buildingName: "বিল্ডিং নাম",
    location: "লোকেশন",
    buyerName: "ক্রেতার নাম",
    buyerPhone: "ক্রেতার ফোন",
    buyerEmail: "ক্রেতার ইমেইল",
    soldPrice: "বিক্রয় মূল্য (BDT)",
    depositAmount: "ডিপোজিট Amount (BDT)",
    ownerPayment: "মালিকের পেমেন্ট (BDT)",
    otherExpenses: "অন্যান্য ব্যয় (BDT)",
    bookingDate: "বুকিং তারিখ ও সময়",
    soldDate: "বিক্রয় তারিখ ও সময়",
    notes: "নোটস",
    cancel: "বাতিল",
    updateTransaction: "লেনদেন আপডেট করুন",
    addTransactionBtn: "লেনদেন যোগ করুন",

    // Actions
    editTransactionAction: "লেনদেন সম্পাদনা",
    viewDetails: "বিস্তারিত দেখুন",
    deleteTransaction: "লেনদেন মুছুন",
    deleteConfirm: "আপনি কি নিশ্চিত যে এই লেনদেনটি মুছতে চান?",

    // Messages
    transactionAdded: "লেনদেন সফলভাবে যোগ করা হয়েছে!",
    transactionUpdated: "লেনদেন সফলভাবে আপডেট করা হয়েছে!",
    transactionDeleted: "লেনদেন সফলভাবে মুছে ফেলা হয়েছে!",
    fetchError: "লেনদেন লোড করতে ব্যর্থ হয়েছে",
    saveError: "লেনদেন সংরক্ষণ করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    deleteError: "লেনদেন মুছতে ব্যর্থ হয়েছে",
    loading: "লেনদেন লোড হচ্ছে...",
    noTransactions: "কোন লেনদেন পাওয়া যায়নি",
    noTransactionsSearch: "আপনার খোঁজার শর্তানুযায়ী কোন লেনদেন পাওয়া যায়নি",
    addFirstTransaction: "আপনার প্রথম লেনদেন যোগ করুন",

    // Validation
    requiredFlat: "ফ্ল্যাট নম্বর আবশ্যক",
    requiredProject: "প্রজেক্টের নাম আবশ্যক",
    requiredBuilding: "বিল্ডিং নাম আবশ্যক",
    requiredLocation: "লোকেশন আবশ্যক",
    requiredBuyer: "ক্রেতার নাম আবশ্যক",
    requiredSoldPrice: "বিক্রয় মূল্য আবশ্যক",
    requiredDeposit: "ডিপোজিট Amount আবশ্যক",
    requiredOwnerPayment: "মালিকের পেমেন্ট আবশ্যক",
    requiredBookingDate: "বুকিং তারিখ আবশ্যক",

    // Examples
    exampleFlat: "যেমন, A-101, B-205",
    exampleProject: "যেমন, স্কাই গার্ডেন, লেক ভিউ",
    exampleBuilding: "যেমন, টাওয়ার A, বিল্ডিং B",
    exampleLocation: "যেমন, গুলশান, বনানী, ধানমন্ডি",
  },
};

// Validation Schema
const transactionValidationSchema = Yup.object({
  flatNumber: Yup.string().required("requiredFlat"),
  projectName: Yup.string().required("requiredProject"),
  buildingName: Yup.string().required("requiredBuilding"),
  location: Yup.string().required("requiredLocation"),
  buyerName: Yup.string().required("requiredBuyer"),
  soldPrice: Yup.number().required("requiredSoldPrice").min(0),
  depositAmount: Yup.number().required("requiredDeposit").min(0),
  ownerPayment: Yup.number().required("requiredOwnerPayment").min(0),
  otherExpenses: Yup.number().min(0),
  bookingDateTime: Yup.string().required("requiredBookingDate"),
  soldDateTime: Yup.string(),
  notes: Yup.string(),
  status: Yup.string(),
});

const AccountsManagement = () => {
  // State Management
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState(null);
  const [buildingFilter, setBuildingFilter] = useState(null);
  const [flatFilter, setFlatFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [language, setLanguage] = useState("bn");

  // Get translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Mock API calls
  const mockApi = {
    getTransactions: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                flatNumber: "A-101",
                projectName: "Sky Garden",
                buildingName: "Tower A",
                location: "Gulshan",
                buyerName: "Abdul Rahman",
                buyerPhone: "+8801712345678",
                buyerEmail: "abdul@email.com",
                soldPrice: 25000000,
                depositAmount: 5000000,
                ownerPayment: 18000000,
                otherExpenses: 500000,
                netProfit: 6500000,
                bookingDateTime: "2024-01-15T10:30:00Z",
                soldDateTime: "2024-02-20T14:45:00Z",
                notes: "First booking with 20% deposit",
                status: "sold",
                createdAt: "2024-01-15",
              },
              {
                id: 2,
                flatNumber: "B-205",
                projectName: "Lake View",
                buildingName: "Tower B",
                location: "Banani",
                buyerName: "Fatima Begum",
                buyerPhone: "+8801812345678",
                buyerEmail: "fatima@email.com",
                soldPrice: 32000000,
                depositAmount: 8000000,
                ownerPayment: 25000000,
                otherExpenses: 750000,
                netProfit: 6250000,
                bookingDateTime: "2024-01-10T09:15:00Z",
                soldDateTime: "2024-03-15T16:20:00Z",
                notes: "Corporate client, special discount applied",
                status: "sold",
                createdAt: "2024-01-10",
              },
              {
                id: 3,
                flatNumber: "C-304",
                projectName: "Green City",
                buildingName: "Tower C",
                location: "Dhanmondi",
                buyerName: "Rahim Ahmed",
                buyerPhone: "+8801912345678",
                buyerEmail: "rahim@email.com",
                soldPrice: 28000000,
                depositAmount: 3000000,
                ownerPayment: 22000000,
                otherExpenses: 400000,
                netProfit: 5600000,
                bookingDateTime: "2024-02-01T11:00:00Z",
                soldDateTime: null,
                notes: "Waiting for bank approval",
                status: "booked",
                createdAt: "2024-02-01",
              },
            ],
          });
        }, 1000);
      });
    },

    createTransaction: async (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const netProfit =
            data.soldPrice - data.ownerPayment - data.otherExpenses;
          resolve({
            data: {
              ...data,
              id: Date.now(),
              netProfit,
              createdAt: new Date().toISOString(),
            },
          });
        }, 500);
      });
    },

    updateTransaction: async (id, data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const netProfit =
            data.soldPrice - data.ownerPayment - data.otherExpenses;
          resolve({ data: { ...data, id, netProfit } });
        }, 500);
      });
    },

    deleteTransaction: async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
  };

  // Format date in Bangladesh time
  const formatBangladeshTime = (dateTime) => {
    if (!dateTime) return "-";
    return dayjs.utc(dateTime).tz("Asia/Dhaka").format("DD MMM YYYY, hh:mm A");
  };

  // Formik for transaction form
  const formik = useFormik({
    initialValues: {
      flatNumber: "",
      projectName: "",
      buildingName: "",
      location: "",
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      soldPrice: 0,
      depositAmount: 0,
      ownerPayment: 0,
      otherExpenses: 0,
      bookingDateTime: dayjs(),
      soldDateTime: null,
      notes: "",
      status: "booked",
    },
    validationSchema: transactionValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const formattedValues = {
          ...values,
          bookingDateTime: values.bookingDateTime.format(),
          soldDateTime: values.soldDateTime
            ? values.soldDateTime.format()
            : null,
        };

        let response;
        if (editingTransaction) {
          response = await mockApi.updateTransaction(
            editingTransaction.id,
            formattedValues
          );
          message.success(t("transactionUpdated"));
        } else {
          response = await mockApi.createTransaction(formattedValues);
          message.success(t("transactionAdded"));
        }

        if (editingTransaction) {
          setTransactions((prev) =>
            prev.map((trans) =>
              trans.id === editingTransaction.id ? response.data : trans
            )
          );
        } else {
          setTransactions((prev) => [...prev, response.data]);
        }

        resetForm();
        setModalVisible(false);
        setEditingTransaction(null);
      } catch (error) {
        message.error(t("saveError"));
        console.error("Save transaction error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions when search or filters change
  useEffect(() => {
    filterTransactions();
  }, [transactions, searchText, locationFilter, buildingFilter, flatFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      message.error(t("fetchError"));
      console.error("Fetch transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.flatNumber.toLowerCase().includes(searchLower) ||
          transaction.projectName.toLowerCase().includes(searchLower) ||
          transaction.buildingName.toLowerCase().includes(searchLower) ||
          transaction.location.toLowerCase().includes(searchLower) ||
          transaction.buyerName.toLowerCase().includes(searchLower)
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    if (buildingFilter) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.buildingName.toLowerCase() ===
          buildingFilter.toLowerCase()
      );
    }

    if (flatFilter) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.flatNumber.toLowerCase() === flatFilter.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
  };

  // Unique values for filters
  const uniqueLocations = useMemo(
    () => [
      ...new Set(transactions.map((trans) => trans.location).filter(Boolean)),
    ],
    [transactions]
  );

  const uniqueBuildings = useMemo(
    () => [
      ...new Set(
        transactions.map((trans) => trans.buildingName).filter(Boolean)
      ),
    ],
    [transactions]
  );

  const uniqueFlats = useMemo(
    () => [
      ...new Set(transactions.map((trans) => trans.flatNumber).filter(Boolean)),
    ],
    [transactions]
  );

  // Handlers
  const handleAddTransaction = () => {
    formik.resetForm();
    formik.setFieldValue("bookingDateTime", dayjs());
    setEditingTransaction(null);
    setModalVisible(true);
  };

  const handleEditTransaction = (transaction) => {
    formik.setValues({
      flatNumber: transaction.flatNumber,
      projectName: transaction.projectName,
      buildingName: transaction.buildingName,
      location: transaction.location,
      buyerName: transaction.buyerName,
      buyerPhone: transaction.buyerPhone,
      buyerEmail: transaction.buyerEmail,
      soldPrice: transaction.soldPrice,
      depositAmount: transaction.depositAmount,
      ownerPayment: transaction.ownerPayment,
      otherExpenses: transaction.otherExpenses,
      bookingDateTime: transaction.bookingDateTime
        ? dayjs(transaction.bookingDateTime)
        : dayjs(),
      soldDateTime: transaction.soldDateTime
        ? dayjs(transaction.soldDateTime)
        : null,
      notes: transaction.notes,
      status: transaction.status,
    });
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setLoading(true);
      await mockApi.deleteTransaction(transactionId);
      setTransactions((prev) =>
        prev.filter((trans) => trans.id !== transactionId)
      );
      message.success(t("transactionDeleted"));
    } catch (error) {
      message.error(t("deleteError"));
      console.error("Delete transaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setLocationFilter(null);
    setBuildingFilter(null);
    setFlatFilter(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  };

  // Statistics
  const statistics = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalSales = transactions.reduce(
      (sum, trans) => sum + trans.soldPrice,
      0
    );
    const totalExpenses = transactions.reduce(
      (sum, trans) => sum + trans.otherExpenses,
      0
    );
    const totalProfit = transactions.reduce(
      (sum, trans) => sum + trans.netProfit,
      0
    );

    return {
      totalTransactions,
      totalSales,
      totalExpenses,
      totalProfit,
    };
  }, [transactions]);

  // Columns definition
  const columns = [
    {
      title: t("flatNumber"),
      dataIndex: "flatNumber",
      key: "flatNumber",
      width: 120,
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
      width: 180,
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
      title: t("financialDetails"),
      key: "financial",
      width: 250,
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("soldPrice")}:</span>
            <span style={{ fontWeight: 600, color: "#52c41a" }}>
              ৳{(record.soldPrice / 1000000).toFixed(1)}M
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("deposit")}:</span>
            <span style={{ color: "#1890ff" }}>
              ৳{(record.depositAmount / 1000000).toFixed(1)}M
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("ownerPayment")}:</span>
            <span style={{ color: "#fa8c16" }}>
              ৳{(record.ownerPayment / 1000000).toFixed(1)}M
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("expenses")}:</span>
            <span style={{ color: "#ff4d4f" }}>
              ৳{(record.otherExpenses / 1000).toFixed(0)}K
            </span>
          </div>
          <Divider style={{ margin: "4px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>{t("netProfit")}:</span>
            <span
              style={{ color: record.netProfit >= 0 ? "#52c41a" : "#ff4d4f" }}
            >
              ৳{(record.netProfit / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t("dates"),
      key: "dates",
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div>
            <CalendarOutlined style={{ marginRight: 4 }} />
            <strong>Booking:</strong>
          </div>
          <div style={{ marginLeft: 16, color: "#666" }}>
            {formatBangladeshTime(record.bookingDateTime)}
          </div>
          {record.soldDateTime && (
            <>
              <div style={{ marginTop: 4 }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                <strong>Sold:</strong>
              </div>
              <div style={{ marginLeft: 16, color: "#666" }}>
                {formatBangladeshTime(record.soldDateTime)}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Buyer Info",
      key: "buyer",
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div style={{ fontWeight: 500 }}>{record.buyerName}</div>
          <div style={{ color: "#666" }}>{record.buyerPhone}</div>
          {record.buyerEmail && (
            <div style={{ color: "#666", fontSize: "11px" }}>
              {record.buyerEmail}
            </div>
          )}
        </div>
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
            status === "sold" ? "green" : status === "booked" ? "blue" : "red"
          }
          style={{ fontWeight: 500 }}
        >
          {t(status)}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditTransaction(record)}
              >
                {t("editTransactionAction")}
              </Menu.Item>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => handleEditTransaction(record)}
              >
                {t("viewDetails")}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                <Popconfirm
                  title={t("deleteConfirm")}
                  onConfirm={() => handleDeleteTransaction(record.id)}
                  okText={language === "en" ? "Yes" : "হ্যাঁ"}
                  cancelText={language === "en" ? "No" : "না"}
                  placement="left"
                >
                  {t("deleteTransaction")}
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
    <ConfigProvider locale={currentLocale}>
      <div
        style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}
      >
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
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
                  <FileTextOutlined />
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
                  onClick={handleAddTransaction}
                  style={{
                    height: "auto",
                    padding: "8px 16px",
                    fontWeight: 600,
                  }}
                >
                  {t("addTransaction")}
                </Button>
              </Space>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("totalTransactions")}
                  value={statistics.totalTransactions}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("totalSales")}
                  value={statistics.totalSales / 1000000}
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
                  title={t("totalExpenses")}
                  value={statistics.totalExpenses / 1000000}
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
                tab={language === "en" ? "Transactions List" : "লেনদেন তালিকা"}
                key="list"
              >
                {/* Filters Section */}
                <div style={{ padding: "24px 24px 16px 24px" }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6}>
                      <Input.Search
                        placeholder={t("searchPlaceholder")}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                      />
                    </Col>

                    <Col xs={8} md={4}>
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

                    <Col xs={8} md={4}>
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

                    <Col xs={8} md={4}>
                      <Select
                        style={{ width: "100%" }}
                        placeholder={t("filterFlat")}
                        value={flatFilter}
                        onChange={setFlatFilter}
                        suffixIcon={<FilterOutlined />}
                        size="large"
                        allowClear
                      >
                        {uniqueFlats.map((flat) => (
                          <Option key={flat} value={flat}>
                            {flat}
                          </Option>
                        ))}
                      </Select>
                    </Col>

                    <Col xs={24} md={6}>
                      <Space
                        style={{ width: "100%", justifyContent: "flex-end" }}
                      >
                        <Button onClick={clearFilters} size="large">
                          {t("clear")}
                        </Button>
                        <Button
                          onClick={fetchTransactions}
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

                {/* Transactions Table */}
                <div style={{ padding: "0 24px 24px 24px" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <Spin size="large" />
                      <div style={{ marginTop: 16, color: "#666" }}>
                        {t("loading")}
                      </div>
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={filteredTransactions}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} ${
                            language === "en" ? "transactions" : "লেনদেন"
                          }`,
                      }}
                      scroll={{ x: 1300 }}
                      size="middle"
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>
                          {searchText ||
                          locationFilter ||
                          buildingFilter ||
                          flatFilter
                            ? t("noTransactionsSearch")
                            : t("noTransactions")}
                        </span>
                      }
                    >
                      <Button type="primary" onClick={handleAddTransaction}>
                        {t("addFirstTransaction")}
                      </Button>
                    </Empty>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Card>

          {/* Add/Edit Transaction Modal */}
          <Modal
            title={
              <span style={{ fontSize: "20px", fontWeight: 600 }}>
                {editingTransaction
                  ? t("editTransaction")
                  : t("addTransaction")}
              </span>
            }
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              formik.resetForm();
              setEditingTransaction(null);
            }}
            footer={null}
            width={800}
            style={{ top: 20 }}
            destroyOnClose
          >
            <Form layout="vertical" onFinish={formik.handleSubmit}>
              <Tabs defaultActiveKey="basic">
                <TabPane tab={t("basicInfo")} key="basic">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("flatNumber")}
                        required
                        validateStatus={formik.errors.flatNumber ? "error" : ""}
                        help={
                          formik.errors.flatNumber
                            ? t(formik.errors.flatNumber)
                            : ""
                        }
                      >
                        <Input
                          name="flatNumber"
                          value={formik.values.flatNumber}
                          onChange={formik.handleChange}
                          placeholder={t("exampleFlat")}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("projectName")}
                        required
                        validateStatus={
                          formik.errors.projectName ? "error" : ""
                        }
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
                        validateStatus={
                          formik.errors.buildingName ? "error" : ""
                        }
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
                          formik.errors.location
                            ? t(formik.errors.location)
                            : ""
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
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={t("buyerName")}
                        required
                        validateStatus={formik.errors.buyerName ? "error" : ""}
                        help={
                          formik.errors.buyerName
                            ? t(formik.errors.buyerName)
                            : ""
                        }
                      >
                        <Input
                          name="buyerName"
                          value={formik.values.buyerName}
                          onChange={formik.handleChange}
                          placeholder="John Doe"
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                      <Form.Item label={t("buyerPhone")}>
                        <Input
                          name="buyerPhone"
                          value={formik.values.buyerPhone}
                          onChange={formik.handleChange}
                          placeholder="+8801XXXXXXXXX"
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                      <Form.Item label={t("buyerEmail")}>
                        <Input
                          name="buyerEmail"
                          value={formik.values.buyerEmail}
                          onChange={formik.handleChange}
                          placeholder="email@example.com"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab={t("financialInfo")} key="financial">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("soldPrice")}
                        required
                        validateStatus={formik.errors.soldPrice ? "error" : ""}
                        help={
                          formik.errors.soldPrice
                            ? t(formik.errors.soldPrice)
                            : ""
                        }
                      >
                        <InputNumber
                          name="soldPrice"
                          value={formik.values.soldPrice}
                          onChange={(value) =>
                            formik.setFieldValue("soldPrice", value)
                          }
                          style={{ width: "100%" }}
                          min={0}
                          formatter={(value) =>
                            `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                          size="large"
                          placeholder="25000000"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("depositAmount")}
                        required
                        validateStatus={
                          formik.errors.depositAmount ? "error" : ""
                        }
                        help={
                          formik.errors.depositAmount
                            ? t(formik.errors.depositAmount)
                            : ""
                        }
                      >
                        <InputNumber
                          name="depositAmount"
                          value={formik.values.depositAmount}
                          onChange={(value) =>
                            formik.setFieldValue("depositAmount", value)
                          }
                          style={{ width: "100%" }}
                          min={0}
                          formatter={(value) =>
                            `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                          size="large"
                          placeholder="5000000"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("ownerPayment")}
                        required
                        validateStatus={
                          formik.errors.ownerPayment ? "error" : ""
                        }
                        help={
                          formik.errors.ownerPayment
                            ? t(formik.errors.ownerPayment)
                            : ""
                        }
                      >
                        <InputNumber
                          name="ownerPayment"
                          value={formik.values.ownerPayment}
                          onChange={(value) =>
                            formik.setFieldValue("ownerPayment", value)
                          }
                          style={{ width: "100%" }}
                          min={0}
                          formatter={(value) =>
                            `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                          size="large"
                          placeholder="18000000"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label={t("otherExpenses")}>
                        <InputNumber
                          name="otherExpenses"
                          value={formik.values.otherExpenses}
                          onChange={(value) =>
                            formik.setFieldValue("otherExpenses", value)
                          }
                          style={{ width: "100%" }}
                          min={0}
                          formatter={(value) =>
                            `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
                          size="large"
                          placeholder="500000"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Net Profit Calculation */}
                  {formik.values.soldPrice > 0 && (
                    <Card
                      size="small"
                      style={{
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {t("netProfit")}:
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color:
                              formik.values.soldPrice -
                                formik.values.ownerPayment -
                                formik.values.otherExpenses >=
                              0
                                ? "#52c41a"
                                : "#ff4d4f",
                          }}
                        >
                          ৳
                          {(
                            formik.values.soldPrice -
                            formik.values.ownerPayment -
                            formik.values.otherExpenses
                          ).toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  )}
                </TabPane>

                <TabPane tab={t("datesInfo")} key="dates">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={t("bookingDate")}
                        required
                        validateStatus={
                          formik.errors.bookingDateTime ? "error" : ""
                        }
                        help={
                          formik.errors.bookingDateTime
                            ? t(formik.errors.bookingDateTime)
                            : ""
                        }
                      >
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={formik.values.bookingDateTime}
                          onChange={(date) =>
                            formik.setFieldValue("bookingDateTime", date)
                          }
                          style={{ width: "100%" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label={t("soldDate")}>
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={formik.values.soldDateTime}
                          onChange={(date) =>
                            formik.setFieldValue("soldDateTime", date)
                          }
                          style={{ width: "100%" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label={t("status")}>
                    <Select
                      value={formik.values.status}
                      onChange={(value) =>
                        formik.setFieldValue("status", value)
                      }
                      size="large"
                    >
                      <Option value="booked">{t("booked")}</Option>
                      <Option value="sold">{t("sold")}</Option>
                      <Option value="cancelled">{t("cancelled")}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t("notes")}>
                    <Input.TextArea
                      name="notes"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      placeholder="Additional notes about this transaction..."
                      rows={4}
                    />
                  </Form.Item>
                </TabPane>
              </Tabs>

              <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      formik.resetForm();
                      setEditingTransaction(null);
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
                    {editingTransaction
                      ? t("updateTransaction")
                      : t("addTransactionBtn")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AccountsManagement;
