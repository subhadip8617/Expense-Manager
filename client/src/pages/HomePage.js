import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Modal, Form, Input, Select, message, Table, DatePicker, Popconfirm} from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState("30");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      setLoading(true);
      if(editable){
        const res = await axios.post(
          "http://localhost:8080/api/v1/transaction/edit-transaction",
          {
            ...values,
            transactionId: editable._id
          }
        );
        if (res.data.success) {
          message.success(res.data.msg);
          getAllTransaction();
        } else {
          message.error(res.data.msg);
        }
      }
      else{
        const res = await axios.post(
          "http://localhost:8080/api/v1/transaction/add-transaction",
          {
            ...values,
            userId: user._id,
          }
        );
        if (res.data.success) {
          message.success(res.data.msg);
          getAllTransaction();
        } else {
          message.error(res.data.msg);
        }
      }
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      message.error(error);
      setLoading(false);
      setShowModal(false);
    }
  };

  const getAllTransaction = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:8080/api/v1/transaction/get-transaction",
        {
          userId: user._id,
          frequency,
          selectedDate,
          type
        }
      );
      setAllTransactions(res.data.transactions);
      setLoading(false);
    } catch (error) {
      message.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async(record) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/v1/transaction/delete-transaction",
        {
          transactionId: record._id
        }
      );
      if (res.data.success) {
        message.success(res.data.msg);
        getAllTransaction();
      } else {
        message.error(res.data.msg);
      }
      setLoading(false);
    } catch (error) {
      message.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllTransaction();
  }, [frequency, selectedDate, type]);

  useEffect(() => {
    if(editable)
      form.setFieldsValue(editable);
    else
      form.resetFields();
  }, [form, editable]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (curDate) => <span>{moment(curDate).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title : "Actions",
      render : (text, record) =>
        <div className="button-container">
          <EditOutlined onClick={() => {
            setEditable(record)
            setShowModal(true)
          }}/>
          <Popconfirm
            title="Delete the transaction"
            description="Are you sure to delete this transaction?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
    }
  ];

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filter">
        <div>
          <h6>Select Frequency</h6>
          <Select
            value={frequency}
            onChange={(curValue) => setFrequency(curValue)}
          >
            <Select.Option value="7">Last 1 week</Select.Option>
            <Select.Option value="30">Last 1 month</Select.Option>
            <Select.Option value="365">Last 1 year </Select.Option>
            <Select.Option value="custom">Custom </Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => {
                setSelectedDate(values);
              }}
            />
          )}
        </div>
        <div className="button-container">
          <UnorderedListOutlined
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <h6>Select Type</h6>
          <Select
            value={type}
            onChange={(curType) => setType(curType)}
          >
            <Select.Option value="all"> All </Select.Option>
            <Select.Option value="income"> Income </Select.Option>
            <Select.Option value="expense"> Expense </Select.Option>
          </Select>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
            }}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
            <Table columns={columns} dataSource={allTransactions} rowKey="_id" />
          ) : (
            <Analytics allTransection={allTransactions}/>
          )}
      </div>
      <Modal forceRender
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        footer={false}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter your amount" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select the type!" }]}
          >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter the category!" }]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="stipened">Stipened</Select.Option>
              <Select.Option value="rent">Rent</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <Input type="date" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary"> Save </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
