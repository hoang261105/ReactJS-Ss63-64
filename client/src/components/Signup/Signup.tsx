import { useEffect, useState } from "react";
import bcrypt from "bcryptjs-react";
import baseURL from "../../api/Api";
import { User } from "../../model/User";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  // Tạo form cho người dùng nhập
  // Lấy thông tin người dùng nhập
  // Khi gửi thông tin lên db.json thì kiểm tra xem email có tồn tại hay k nếu có thông báo lỗi
  // axios.get(`http://localhost:9000/users?email_like=${email}`)
  // Có 2 kq trả về
  // 1. Là []: Chứng tỏ email chưa tồn tại trong mảng user
  // + Lưu lên db.json
  // + Mã hóa mk rồi mới lưu
  // - Dùng thư viện bcrypt để mã hóa
  // 2. Là [{}]: Chứng tỏ email đã tồn tại
  //   useEffect(() => {
  //     const pass: string = "123456";
  //     bcrypt.hash(pass, 10, function (err, hash) {
  //       // Store hash in your password DB.
  //       //   console.log(hash);
  //       let passToken =
  //         "$2a$10$TRyrvFcYsZPH1H6T7ewtwOwOxeg5cFJ9laOz8HctYRlLsIxCK7S2i";
  //       bcrypt.compare(pass, hash, (err, res) => {
  //         console.log("So sánh hai mật khẩu", res);
  //       });
  //     });
  //   }, []);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<User>({
    id: Math.ceil(Math.random() * 10000),
    email: "",
    password: "",
    confirmPassWord: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<User[]>([]);

  const loadData = () => {
    baseURL
      .get(`users`)
      .then((response: AxiosResponse) => setUser(response.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [inputValue]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!inputValue.email) {
      setEmailError("Email không được để trống");
      isValid = false;
    }

    if (!inputValue.password) {
      setPasswordError("Mật khẩu không được để trống");
      isValid = false;
    }

    if (!inputValue.confirmPassWord) {
      setConfirmPasswordError("Xác nhận mật khẩu không được để trống");
      isValid = false;
    }

    if (!isValid) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputValue.email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    if (inputValue.password !== inputValue.confirmPassWord) {
      setConfirmPasswordError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const response = await baseURL.get(
        `users?email_like=${inputValue.email}`
      );
      if (response.data.length > 0) {
        setEmailError("Email đã tồn tại");
      } else {
        const hashPassword = await bcrypt.hash(inputValue.password, 10);
        const newUser = {
          ...inputValue,
          password: hashPassword,
          confirmPassWord: undefined,
        };
        await baseURL.post(`users`, newUser);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Email</label> <br /> <br />
          <input
            type="text"
            name="email"
            placeholder="Nhập email"
            value={inputValue.email}
            onChange={handleChange}
          />
        </div>
        {emailError && (
          <span style={{ fontSize: 12, color: "red" }}>{emailError}</span>
        )}
        <br />
        <div>
          <label htmlFor="">Mât khẩu</label> <br /> <br />
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            onChange={handleChange}
            value={inputValue.password}
          />
        </div>
        {passwordError && (
          <span style={{ fontSize: 12, color: "red" }}>{passwordError}</span>
        )}
        <br />
        <div>
          <label htmlFor="">Xác nhận mât khẩu</label> <br /> <br />
          <input
            type="password"
            name="confirmPassWord"
            placeholder="Nhập mật khẩu"
            onChange={handleChange}
            value={inputValue.confirmPassWord}
          />
        </div>
        {confirmPasswordError && (
          <span style={{ fontSize: 12, color: "red" }}>
            {confirmPasswordError}
          </span>
        )}
        <br /> <br />
        <button>Đăng ký</button>
      </form>
    </div>
  );
}
