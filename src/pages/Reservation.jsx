import { Avatar, Carousel, Divider, Drawer, Space, Spin, Tag, notification } from "antd";
import DataTable, { renderColor, renderIcon } from "../components/DataTable";
import Header from "../components/Header";
import TableComponent from "../components/Table";
import { PictureOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getReservation } from "../feature/API";
import FilterBoxe from "../components/FilterBoxe";
import Map from "../components/Map";
import { Icon } from "../constant/Icon";
function FormatDate(dateStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", options);
}
const columns = [
    {
        title: "Résidences",
        dataIndex: "nom",
        key: "nom",
        render: (text, record) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
                onClick={() => showDrawer(record)}
            >
                <img src={record.img} alt="" />
                <div>
                    <p> {record.residence.name}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.residence.address}
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
                <p>{text}</p>
                <p style={{ fontSize: 12, color: "#888" }}>{record.email}</p>
            </div>
        ),
        responsive: ["md"],
    },
    {
        title: "Client",
        dataIndex: "user",
        key: "owner",
        render: (text, record) => (
            <div>
                <p>
                    {record.user.firstname} {record.user.lastname}
                </p>
                <p style={{ fontSize: 12, color: "#888" }}>
                    {record.user.email}
                </p>
            </div>
        ),
        responsive: ["md"],
    },
    {
        title: "Total",
        dataIndex: "prix",
        key: "price",
        render: (text, record) => <span> {record.residence.price} fcfa </span>,
        responsive: ["md"],
    },

    {
        title: "Date d'ajout",
        key: "date",
        dataIndex: "createdAt",
        render: (text) => <span>{FormatDate(text)}</span>,
        responsive: ["lg"],
    },
    {
        title: "Statut",
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
];



const Reservation = () => {
    const columns = [
        {
            title: "Résidences",
            dataIndex: "nom",
            key: "nom",
            render: (text, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                    onClick={() => showDrawer(record)}
                >
                    <img
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10%",
                        }}
                        src={`https://api.trouvechap.com/assets/uploads/residences/${record?.residence?.medias[0].filename}`}
                        alt=""
                    />
                    <div>
                        <p> {record.residence.name}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record.residence.address}
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
                    <p>{text}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Client",
            dataIndex: "user",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>
                        {record.user.firstname} {record.user.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.user.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Total",
            dataIndex: "prix",
            key: "price",
            render: (text, record) => (
                <span> {record.residence.price} fcfa </span>
            ),
            responsive: ["md"],
        },

        {
            title: "Date d'ajout",
            key: "date",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["lg"],
        },
        {
            title: "Statut",
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
    ];
    const [loading, setLoading] = useOutletContext();
    const [reservation, setReservation] = useState([]);
        const [open, setOpen] = useState(false);

    const [selectItem, setSelectItem] = useState(null);
    const [current, setCurrent] = useState(1);
    const [location, setLocation] = useState(null);
    const [api, contextHolder] = notification.useNotification();
        const [filtertext, setFilterText] = useState("");

    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
     const showDrawer = async (data) => {
         setSelectItem(data);
         let loc = {
             address: data.address,
             lat: parseInt(data.lat),
             lng: parseInt(data.lng),
         };
         setLocation(loc);
         console.log(selectItem);
         console.log(location);
         setOpen(true);
     };
     const onClose = () => {
         setOpen(false);
     };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: current,
        limit: 7,

    };
    const fetchReservation = async () => {
        setLoading(true);
        const res = await getReservation(params,headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        console.log(res);
        setReservation(res.data);
        setLoading(false);
    };
    useEffect(() => {
        fetchReservation();
    }, [current]);
    return (
        <main>
            <>
                <Header
                    title={"RESERVATION"}
                    path={"Réservations"}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            filtertext={filtertext}
                        />
                    }
                />
                <DrawerComponent
                    showDrawer={showDrawer}
                    selectItem={selectItem}
                    onClose={onClose}
                    open={open}
                />
                <DataTable
                    column={columns}
                    data={reservation.filter((item) => {
                        return item?.residence?.name
                            .toLowerCase()
                            .includes(filtertext.toLowerCase());
                    })}
                    size={7}
                    onChange={({ current }) => {
                        setCurrent(current);
                    }}
                />
            </>
        </main>
    );
};
export default Reservation;
const subtitleSryle = {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    justifyContent: "space-around",
    fontSize: "12px",
    fontWeight: "bold",
};
const spaceStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    justifyContent: "space-between",
};
const listStyle = {
    fontWeight: "bold",
};

const DrawerComponent = ({ selectItem, onClose,showDrawer,open }) => {
    return (
        <Drawer
            style={{
                overflowX: "hidden",
            }}
            placement="right"
            onClose={onClose}
            open={open}
        >
            <div
                style={{
                    position: "relative",
                }}
                className="top"
            >
                <Carousel autoplay>
                    {selectItem &&
                        selectItem?.residence?.medias?.map((item) => (
                            <div>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "156px",
                                        objectFit: "cover",
                                        resizeMode: "cover",
                                    }}
                                    src={`https://api.trouvechap.com/assets/uploads/residences/${item.filename}`}
                                    alt=""
                                />
                            </div>
                        ))}
                </Carousel>
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        color: "#000",
                        padding: "10px 18px ",
                        backgroundColor: "#fff",
                        borderRadius: "100px",
                    }}
                >
                    <span>
                        <PictureOutlined /> +
                        {selectItem && selectItem?.residence?.medias?.length}{" "}
                        photos
                    </span>
                </div>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {selectItem && selectItem?.residence.name}
            </h2>
            <span>{selectItem && selectItem?.residence.address}</span>
            <Divider />
            <div className="price">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectItem && selectItem?.residence.price} fcfa / nuits
                </h2>
                <p>Prix</p>
            </div>
            <Divider />
            <h3
                style={{
                    color: "#1B2559",
                    margin: "10px 0",
                }}
            >
                Info Hôte
            </h3>
            <div
                style={{
                    display: "flex",

                    alignItems: "center",
                }}
                className="user"
            >
                <Avatar size={64} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                    }}
                >
                    <h3>
                        {selectItem && selectItem?.residence?.host?.firstname}{" "}
                        {selectItem && selectItem?.residence?.host?.lastname}
                    </h3>
                    <p>{selectItem && selectItem?.residence?.host?.email}</p>
                    <p>{selectItem && selectItem?.residence?.host?.contact}</p>
                </div>
            </div>
            <Divider />
            <h3
                style={{
                    color: "#1B2559",
                    margin: "10px 0",
                }}
            >
                Info Client
            </h3>
            <div
                style={{
                    display: "flex",

                    alignItems: "center",
                }}
                className="user"
            >
                <Avatar size={64} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                    }}
                >
                    <h3>
                        {selectItem && selectItem?.user?.firstname}{" "}
                        {selectItem && selectItem?.user?.lastname}
                    </h3>
                    <p>{selectItem && selectItem?.user?.email}</p>
                    <p>{selectItem && selectItem?.user?.contact}</p>
                </div>
            </div>
            <Divider />
            <div orientation="vertical">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    Réservation
                </h2>
                <div>
                    <span>Nombre de personnes</span>
                    <h3>4 personnes</h3>
                </div>
            </div>
            <Divider />

            <div
                style={{
                    display: "flex",

                    gap: "5px",
                    marginTop: "10px",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                    className="left"
                >
                    <div style={subtitleSryle} className="subti">
                        <p>Arrivée</p>
                    </div>
                    <h3>{FormatDate(selectItem?.fromDate)} </h3>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                    className="rigth"
                >
                    <div style={subtitleSryle} className="subti">
                        <p>Depart</p>
                    </div>
                    <h3>{FormatDate(selectItem?.toDate)} </h3>
                </div>
            </div>

            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Montant de réservation
            </h2>
            <div style={spaceStyle}>
                <span>Sous Total:</span>
                <h3>{selectItem?.subtotal}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Frais:</span>
                <h3>{selectItem?.fee}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Total:</span>
                <h3>{selectItem?.total}</h3>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Revenus
            </h2>
            <div style={spaceStyle}>
                <span>Part de l’hôte :</span>
                <h3>{selectItem?.hostMoney}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Part de Trouvechap :</span>
                <h3>{selectItem?.companyMoney}</h3>
            </div>
            <Divider />
            <div style={spaceStyle}>
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    Code de validation
                </h2>
                <h3 style={{ color: "#A273FF" }}>{selectItem?.clientCode}</h3>
            </div>
            <Divider />
            <div style={spaceStyle}>
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    Statut de la demande
                </h2>
                <Tag color={renderColor(selectItem?.status)}>
                    {selectItem?.status}
                </Tag>
            </div>
            <Divider />
            {selectItem?.cancelledAt !== null && (
                <>
                    <div style={spaceStyle}>
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Date d'annulation
                        </h2>
                        <h3>{FormatDate(selectItem?.cancelleAt)}</h3>
                    </div>
                </>
            )}
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Grille de remboursement
            </h2>
            <div>
                <ul>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Annulation entre 48h et 1 semaine
                        </li>
                        <span>25.000 fcfa</span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Annulation entre 48h et 1 semaine
                        </li>
                        <span>25.000 fcfa</span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Annulation entre 1 mois et 3 mois
                        </li>
                        <span>25.000 fcfa</span>
                    </div>
                </ul>
            </div>
            <Divider />
            <Map location={location} />
        </Drawer>
    );
};
