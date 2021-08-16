import React from "react";
import classNames from "classnames";
import styles from "./modal.css";
import PropTypes from "prop-types";

const modalComponent = (props) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <div className={styles.modalTitle}>{props.title}</div>
            <div className={styles.modalInnerContent}>{props.children}</div>
        </div>
    </div>
);

modalComponent.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
};

export default modalComponent;
