
import { Button, Form, Input, notification } from "antd";
import styles from "./style.module.scss";
import { useState } from "react";
import { changeProfileService } from "./api/change_profile";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";


interface Props {
    current_user?: any;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

interface CustomizedFormProps {
    onChange: (fields: FieldData[]) => void;
    fields: FieldData[];
    onSubmit: (data: any) => void;
    onFailure: (data: any) => void;
}

const CustomizedForm: React.FC<CustomizedFormProps> = ({ onChange, fields, onFailure, onSubmit }) => (
    <Form
        name="profile"
        {...formItemLayout}
        fields={fields}
        onFieldsChange={(_, allFields) => {
            onChange(allFields);
        }}
        onFinish={onSubmit}
        onFinishFailed={onFailure}
    >
        <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Email is required!' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="old_password"
            label="Old Password"
            rules={[{ required: true, message: 'Old password is required!' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            name="new_password"
            label="New Password"
            rules={[{ required: true, message: 'New password is required!' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={['new_password']}
            hasFeedback
            rules={[
                {
                    required: true,
                    message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                }),
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
            <Button className={styles.button} htmlType="submit">
                Update Profile
            </Button>
        </Form.Item>
    </Form>
);


function Profile(props: Props) {

    const [fields, setFields] = useState<FieldData[]>([
        {
            name: ['email'],
            value: props.current_user?.email,
        },
        {
            name: ['old_password'],
            value: '',
        },
        {
            name: ['new_password'],
            value: '',
        },
        {
            name: ['confirm_password'],
            value: '',
        }
    ]);

    const onFinish = (values: any) => {
        const data = {
            email: values?.email,
            old_password: values?.old_password,
            password: values?.new_password
        }

        changeProfileService(props.current_user?.id, data).then(() => {
            notification.success({
                message: "You have been change your profile successfully!",
                icon: (
                    <CheckCircleOutlined className="done"/>
                )
            })
        }).catch((res) => {
            notification.error({
                message: `Could not change profile. Please try again!`,
                description: ` ${res?.response?.data?.detail}`,
                icon: (
                    <WarningOutlined className='warning'/>
                )
            })
        })
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={styles.container}>
            <CustomizedForm
                fields={fields}
                onChange={(newFields) => {
                    setFields(newFields);
                }}
                onFailure={(error: any) => onFinishFailed(error)}
                onSubmit={(values: any) => onFinish(values)}
            />
        </div>
    )
}

export default Profile