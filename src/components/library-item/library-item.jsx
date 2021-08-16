import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import styles from "./library-item.css";
import Box from "../box/box.jsx";

const libraryItemComponent = (
    props /*
    <div
        className={styles.libraryItem}
        onClick={(e) => props.onClick(props.md5ext)}
    >
        <div
            className={styles.libraryItemImageContainerWrapper}
        >
            <div
                className={styles.libraryItemImageContainer}
            >
                <img
                    className={styles.libraryItemImage}
                    src={`https://cdn.assets.scratch.mit.edu/internalapi/asset/${props.md5ext}/get/`}
                />
            </div>
        </div>
    </div> */
) => (
    <Box
        className={classNames(styles.libraryItem)}
        role="button"
        tabIndex="0"
        onClick={(e) =>
            props.onClick(props.md5ext, props.name, props.url, props.type)
        }
    >
        <Box className={styles.libraryItemImageContainerWrapper}>
            <Box className={styles.libraryItemImageContainer}>
                <img
                    className={styles.libraryItemImage}
                    src={
                        props.url ||
                        `https://cdn.assets.scratch.mit.edu/internalapi/asset/${props.md5ext}/get/`
                    }
                />
            </Box>
        </Box>
        <span className={styles.libraryItemName}>{props.name}</span>
    </Box>
);

libraryItemComponent.propTypes = {
    md5ext: PropTypes.string,
    onClick: PropTypes.func,
    url: PropTypes.string,
};
export default libraryItemComponent;
