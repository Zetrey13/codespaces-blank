import React from "react";
import { Table, Tag } from "antd";
import { DATA2 } from "../data";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

export const renderIcon = (status) => {
    switch (status) {
        case "Validé":
            return <CheckCircleOutlined color="#fff" />;
        case "Rejeté":
            return <CloseCircleOutlined color="#fff" />;
        case "En Attente":
            return <ExclamationCircleOutlined color="#fff" />;
        default:
            return null;
    }
};

export const renderColor = (status) => {
    switch (status) {
        case "Validé":
            return "#22C55E";
        case "Rejeté":
            return "#EF4444";
        case "En Attente":
            return "#F59F0B";
        default:
            return null;
    }
};
export function FormatDate(dateStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", options);
}
const columns = [
    {
        title: "Résidences",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <img
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10%",
                    }}
                    src={`https://api.trouvechap.com/assets/uploads/residences/${record.medias[0].filename}`}
                    alt=""
                />
                <div>
                    <p>{text}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.address}
                    </p>
                </div>
            </div>
        ),
    },
    {
        title: "Hôte",
        dataIndex: "owner",
        key: "owner",
        render: (text, record) => (
            <div>
                <p>
                    {record.host.firstname} {record.host.lastname}
                </p>
                <p style={{ fontSize: 12, color: "#888" }}>{record.email}</p>
            </div>
        ),
        responsive: ["md"],
    },
    {
        title: "Prix / nuits",
        dataIndex: "price",
        key: "price",
        render: (text) => <span>{text} fcfa </span>,
        responsive: ["md"],
    },
    {
        title: "Moyen de paiement",
        key: "payment",
        dataIndex: "payment",
        render: (text) => <span>{text} </span>,
        responsive: ["md"],
    },
    {
        title: "Date d'ajout",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (text) => <span>{FormatDate(text)}</span>,
        responsive: ["lg"],
    },
    {
        title: "Status",
        key: "status",
        render: (_, record) => (
            <Tag
                icon={renderIcon(record.status)}
                color={renderColor(record.status)}
                key={record.status}
            >
                {record.status}
            </Tag>
        ),
        responsive: ["md"],
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => <Tag color="red">delete</Tag>,
        responsive: ["lg"],
    },
];

const DataTable = ({ column, data, size, onclick, onChange, pagination,loading }) => {
    const handleRowClick = (record) => {
        onclick && onclick(record);
    };
    return (
        <Table
            style={{
                backgroundColor: "#fff",
                borderRadius: "18px",
                padding: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)",
            }}
            size="small"
            bordered={false}
            columns={column ? column : columns}
            dataSource={data ? data : DATA2}
            pagination={{
                pageSize: size ? size : 5,
                ...pagination,
            }}
            onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })}
            onChange={onChange}
            loading={loading}
        />
    );
};

export default DataTable;
