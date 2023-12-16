
import React, { useEffect } from "react";
import styles from "./style.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import storage from "../../utils/storage";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

interface Props {
    children?: React.ReactNode
}


export function Layout({ children }: Props): JSX.Element {
    const navigate = useNavigate()

    useEffect(() => {
        if (!storage.getToken()) navigate("/sign_in")
    }, [navigate]);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.center}>
                <Sidebar />
                <div>
                    <Outlet />
                    {children}
                </div>
            </div>
        </div>
    )
}
