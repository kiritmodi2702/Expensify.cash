import React, {Component} from 'react';
import CenteredModal from './Modals/CenteredModal';
import PropTypes from 'prop-types';
import {
    View, TouchableOpacity, Text,
} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import AttachmentView from './AttachmentView';
import styles, {colors} from '../styles/StyleSheet';
import ModalHeader from './ModalHeader';
import ONYXKEYS from '../ONYXKEYS';
import addAuthTokenToURL from '../libs/addAuthTokenToURL';

/**
 * Modal render prop component that exposes modal launching triggers that can be used
 * to display a full size image or PDF modally with optional confirmation button.
 */

const propTypes = {
    // Title of the modal header
    title: PropTypes.string,

    // Optional source URL for the image shown inside the .
    // If not passed in via props must be specified when modal is opened.
    sourceURL: PropTypes.string,

    // Optional callback to fire when we want to preview an image and approve it for use.
    onConfirm: PropTypes.func,

    // A function as a child to pass modal launching methods to
    children: PropTypes.func.isRequired,

    // Do the urls require an authToken?
    isAuthTokenRequired: PropTypes.bool.isRequired,

    // Current user session
    session: PropTypes.shape({
        authToken: PropTypes.string.isRequired,
    }).isRequired,
};

const defaultProps = {
    title: '',
    sourceURL: null,
    onConfirm: null,
};

class AttachmentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            file: null,
            sourceURL: props.sourceURL,
        };
    }

    render() {
        const sourceURL = addAuthTokenToURL({
            url: this.state.sourceURL,
            authToken: this.props.session.authToken,
            required: this.props.isAuthTokenRequired,
        });

        return (
            <>
                <CenteredModal
                    onClose={() => this.setState({isModalOpen: false})}
                    isVisible={this.state.isModalOpen}
                >
                    <View style={styles.modalViewContainer}>
                        <ModalHeader
                            title={this.props.title}
                            onCloseButtonPress={() => this.setState({isModalOpen: false})}
                        />
                        <View style={styles.imageModalImageCenterContainer}>
                            {this.state.sourceURL && (
                                <AttachmentView sourceURL={sourceURL} />
                            )}
                        </View>

                        {/* If we have an onConfirm method show a confirmation button */}
                        {this.props.onConfirm && (
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSuccess, styles.buttonConfirm]}
                                underlayColor={colors.componentBG}
                                onPress={() => {
                                    this.props.onConfirm(this.state.file);
                                    this.setState({isModalOpen: false});
                                }}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        styles.buttonSuccessText,
                                        styles.buttonConfirmText,
                                    ]}
                                >
                                    Upload
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </CenteredModal>
                {this.props.children({
                    displayFileInModal: ({file}) => {
                        if (file instanceof File) {
                            const source = URL.createObjectURL(file);
                            this.setState({isModalOpen: true, sourceURL: source, file});
                        } else {
                            this.setState({isModalOpen: true, sourceURL: file.uri, file});
                        }
                    },
                    show: () => {
                        this.setState({isModalOpen: true});
                    },
                })}
            </>
        );
    }
}

AttachmentModal.propTypes = propTypes;
AttachmentModal.defaultProps = defaultProps;
export default withOnyx({
    session: {
        key: ONYXKEYS.SESSION,
    },
})(AttachmentModal);