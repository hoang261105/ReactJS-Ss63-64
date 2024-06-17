import React, { useState } from "react";
import baseURL from "../../api/Api";
import bcrypt from "bcryptjs-react";
import { LoginUser } from "../../model/User";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginUser>({
    email: "",
    password: "",
  });
  /*
        Nhập email và pass
        Vào db xem email của người dùng nhập có tồn tại trong db.json hay k
        Nếu có thì lấy thông tin của user
        {
            id, userName, pass, email
        } 
        Dùng bcrypt.compare()
    */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    setEmailError(null);
    setPasswordError(null);
    if (!user.email) {
      setEmailError("Email không được để trống");
      isValid = false;
    }
    if (!user.password) {
      setPasswordError("Mật khẩu không được để trống");
      isValid = false;
    }
    try {
      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
      const response = await baseURL.get(`users?email_like=${email}`);
      if (response.data.length === 0) {
        setEmailError("Email không tồn tại");
      }
      const user = response.data[0];
      // So sánh mật khẩu đã nhập với mật khẩu mã hóa trong cơ sở dữ liệu
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        alert("Đăng nhập thành công");
      } else {
        setPasswordError("Mật khẩu không đúng");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>
        <div>
          <label htmlFor="">Email</label> <br />
          <input
            type="text"
            name="email"
            placeholder="Nhập email"
            onChange={handleChange}
          />{" "}
        </div>
        {emailError && <div style={{ color: "red" }}>{emailError}</div>}
        <br />
        <div>
          <label htmlFor="">Mật khẩu</label> <br />
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            onChange={handleChange}
          />{" "}
        </div>

        {passwordError && <span style={{ color: "red" }}>{passwordError}</span>}
        <br />
        <button>Đăng nhập</button>
      </form>
    </div>
  );
}
