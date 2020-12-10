import React from 'react';
import {View, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import Str from 'expensify-common/lib/str';
import styles from '../styles/StyleSheet';
import PDFView from './PDFView';
import ImageView from './ImageView';
import iconFile from '../../assets/images/icon-file.png';

const propTypes = {
    // URL to full-sized attachment
    sourceURL: PropTypes.string.isRequired,

    file: PropTypes.shape({
        name: PropTypes.string,
    }),
};

const defaultProps = {
    file: {
        name: 'Unknown Filename',
    },
};

const AttachmentView = (props) => {
    if (Str.isPDF(props.sourceURL)) {
        return (
            <PDFView
                sourceURL={props.sourceURL}
                style={styles.imageModalPDF}
            />
        );
    }

    // For this check we use both sourceURL and file.name since temporary file sourceURL is a blob
    // both PDFs and images will appear as images when pasted into the the text field
    if (Str.isImage(props.sourceURL) || (props.file && Str.isImage(props.file.name))) {
        return (
            <ImageView url={props.sourceURL} />
        );
    }

    return (
        <View
            style={styles.defaultAttachmentView}
        >
            <Image
                source={iconFile}
                style={styles.defaultAttachmentViewIcon}
            />
            <Text style={styles.textStrong}>{props.file && props.file.name}</Text>
        </View>
    );
};

AttachmentView.propTypes = propTypes;
AttachmentView.defaultProps = defaultProps;
AttachmentView.displayName = 'AttachmentView';

export default AttachmentView;
