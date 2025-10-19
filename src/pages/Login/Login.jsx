 import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.scss";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const validationSchema = Yup.object({
    Email: Yup.string()
      .email("Invalid email format")
      .matches(/@akraitsystems\.com$/i, "Must end with @akraitsystems.com") // case-insensitive
      .required("Required"),
    Password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const updatedValues = {
        ...values,
        Email: values.Email.toLowerCase(),
      };

      const success = await login(updatedValues);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setFieldError("Password", err.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>TREALX</h2>
        <h3>ADMIN LOGIN</h3>

        <Formik
          initialValues={{ Email: "", Password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="email" name="Email" placeholder="Email/UserID" />
              <ErrorMessage name="Email" component="p" className="error-message" />

              <Field type="password" name="Password" placeholder="Password" />
              <ErrorMessage name="Password" component="p" className="error-message" />

              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
