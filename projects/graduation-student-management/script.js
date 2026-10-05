/* ===== DỮ LIỆU MẪU ===== */
let dsSinhVien = [
  { masv:"SV001", hoten:"Nguyễn Văn An",  lop:"CNTT-K11", dlt:8.5, dth:9.0 },
  { masv:"SV002", hoten:"Trần Thị Bình",  lop:"CNTT-K11", dlt:7.0, dth:6.5 },
  { masv:"SV003", hoten:"Lê Minh Cường",  lop:"KT-K11",   dlt:5.5, dth:5.0 },
  { masv:"SV004", hoten:"Phạm Thu Dung",  lop:"KT-K11",   dlt:4.0, dth:4.5 },
  { masv:"SV005", hoten:"Hoàng Gia Huy",  lop:"CNTT-K12", dlt:9.0, dth:8.5 }
];

let dsHienTai = [...dsSinhVien];   // danh sách đang hiển thị
let maDangSua = null;              // mã sinh viên đang ở chế độ sửa
let sapXep = { cot:null, tang:true };
let maVuaThem = null;              // để làm nổi dòng mới

/* ===== TIỆN ÍCH ===== */
const dtb = sv => (sv.dlt + sv.dth) / 2;

function xepLoai(d){
  if (d >= 8.0) return "Giỏi";
  if (d >= 6.5) return "Khá";
  if (d >= 5.0) return "Trung bình";
  return "Yếu";
}
const lopTag = l => l==="Giỏi" ? "tag-gioi" : l==="Khá" ? "tag-kha" : l==="Trung bình" ? "tag-tb" : "tag-yeu";

// Chữ cái đầu làm avatar, màu sinh theo tên
function chuCaiDau(ten){
  const p = ten.trim().split(/\s+/);
  return (p[0][0] + (p[p.length-1][0] || "")).toUpperCase();
}
function mauAvatar(ten){
  let h = 0;
  for (let i = 0; i < ten.length; i++) h = ten.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 45%, 45%)`;
}

/* ===== THÔNG BÁO NỔI ===== */
function hienThongBao(nd, loai){
  let box = document.getElementById("toast-box");
  if (!box){
    box = document.createElement("div");
    box.id = "toast-box";
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "toast " + loai;
  t.innerHTML = `<b>${loai === "ok" ? "✓" : "!"}</b><span>${nd}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add("an"); setTimeout(() => t.remove(), 300); }, 2800);
}
const baoLoi = nd => hienThongBao(nd, "loi");
const baoOK  = nd => hienThongBao(nd, "ok");

/* ===== HIỂN THỊ DANH SÁCH ===== */
function hienThi(ds){
  dsHienTai = ds;
  const tbody = document.getElementById("tbody");

  if (ds.length === 0){
    tbody.innerHTML = '<tr><td colspan="9" class="trong">Chưa có sinh viên nào. Hãy nhập thông tin ở phía trên để bắt đầu.</td></tr>';
  } else {
    tbody.innerHTML = ds.map((sv, i) => {
      const d = dtb(sv), loai = xepLoai(d);
      return `
      <tr class="${sv.masv === maVuaThem ? "moi" : ""}">
        <td>${i + 1}</td>
        <td>${sv.masv}</td>
        <td>
          <div class="nguoi">
            <span class="avatar" style="background:${mauAvatar(sv.hoten)}">${chuCaiDau(sv.hoten)}</span>
            ${sv.hoten}
          </div>
        </td>
        <td><span class="lop-tag">${sv.lop}</span></td>
        <td>${sv.dlt.toFixed(1)}</td>
        <td>${sv.dth.toFixed(1)}</td>
        <td>
          <div class="diem">${d.toFixed(2)}</div>
          <div class="thanh"><i style="width:${d * 10}%"></i></div>
        </td>
        <td><span class="tag ${lopTag(loai)}">${loai}</span></td>
        <td class="thao-tac">
          <button class="btn-sua" onclick="suaSinhVien('${sv.masv}')">Sửa</button>
          <button class="btn-xoa" onclick="xoaSinhVien('${sv.masv}')">Xóa</button>
        </td>
      </tr>`;
    }).join("");
  }

  maVuaThem = null;
  document.getElementById("tongso").textContent = ds.length + " sinh viên";
  thongKe();
}

/* ===== THỐNG KÊ (số đếm tăng dần) ===== */
function demSo(el, dich){
  const batDau = parseInt(el.textContent) || 0;
  if (batDau === dich) return;
  const buoc = dich > batDau ? 1 : -1;
  let hienTai = batDau;
  const id = setInterval(() => {
    hienTai += buoc;
    el.textContent = hienTai;
    if (hienTai === dich) clearInterval(id);
  }, 60);
}

function thongKe(){
  const dem = { "Giỏi":0, "Khá":0, "Trung bình":0, "Yếu":0 };
  dsSinhVien.forEach(sv => dem[xepLoai(dtb(sv))]++);
  demSo(document.getElementById("sl-gioi"), dem["Giỏi"]);
  demSo(document.getElementById("sl-kha"),  dem["Khá"]);
  demSo(document.getElementById("sl-tb"),   dem["Trung bình"]);
  demSo(document.getElementById("sl-yeu"),  dem["Yếu"]);
}

/* ===== THÊM / CẬP NHẬT ===== */
function themSinhVien(){
  const masv  = document.getElementById("masv").value.trim();
  const hoten = document.getElementById("hoten").value.trim();
  const lop   = document.getElementById("lop").value.trim();
  const dlt   = parseFloat(document.getElementById("dlt").value);
  const dth   = parseFloat(document.getElementById("dth").value);

  if (masv === "")  return loiTai("masv",  "Mã sinh viên không được để trống.");
  if (hoten === "") return loiTai("hoten", "Họ tên không được để trống.");
  if (lop === "")   return loiTai("lop",   "Lớp không được để trống.");
  if (isNaN(dlt) || dlt < 0 || dlt > 10) return loiTai("dlt", "Điểm lý thuyết phải là số từ 0 đến 10.");
  if (isNaN(dth) || dth < 0 || dth > 10) return loiTai("dth", "Điểm thực hành phải là số từ 0 đến 10.");

  if (maDangSua){                                  // đang sửa
    const sv = dsSinhVien.find(s => s.masv === maDangSua);
    Object.assign(sv, { masv, hoten, lop, dlt, dth });
    ketThucSua();
    baoOK("Đã cập nhật " + hoten + ".");
  } else {                                         // thêm mới
    if (dsSinhVien.some(s => s.masv.toLowerCase() === masv.toLowerCase()))
      return loiTai("masv", "Mã sinh viên đã tồn tại.");
    dsSinhVien.push({ masv, hoten, lop, dlt, dth });
    baoOK("Đã thêm " + hoten + " vào danh sách.");
  }

  maVuaThem = masv;
  hienThi(dsSinhVien);
  lamMoi();
}

// Báo lỗi kèm rung ô nhập sai
function loiTai(id, nd){
  const o = document.getElementById(id);
  o.classList.add("sai");
  o.focus();
  setTimeout(() => o.classList.remove("sai"), 600);
  baoLoi(nd);
}

/* ===== SỬA ===== */
function suaSinhVien(masv){
  const sv = dsSinhVien.find(s => s.masv === masv);
  if (!sv) return;
  document.getElementById("masv").value  = sv.masv;
  document.getElementById("hoten").value = sv.hoten;
  document.getElementById("lop").value   = sv.lop;
  document.getElementById("dlt").value   = sv.dlt;
  document.getElementById("dth").value   = sv.dth;

  maDangSua = masv;
  document.querySelector(".btn-primary").textContent = "Lưu thay đổi";
  document.querySelector(".form-panel").classList.add("dang-sua");
  document.getElementById("khu-nhap").scrollIntoView({ behavior:"smooth", block:"center" });
}

function ketThucSua(){
  maDangSua = null;
  document.querySelector(".btn-primary").textContent = "Thêm sinh viên";
  document.querySelector(".form-panel").classList.remove("dang-sua");
}

/* ===== XÓA ===== */
function xoaSinhVien(masv){
  const sv = dsSinhVien.find(s => s.masv === masv);
  if (!confirm("Xóa sinh viên " + sv.hoten + " khỏi danh sách?")) return;
  dsSinhVien = dsSinhVien.filter(s => s.masv !== masv);
  if (maDangSua === masv) { ketThucSua(); lamMoi(); }
  hienThi(dsSinhVien);
  baoOK("Đã xóa " + sv.hoten + ".");
}

/* ===== TÌM KIẾM ===== */
function timKiem(){
  const tk = document.getElementById("tukhoa").value.trim().toLowerCase();
  if (tk === "") return hienThi(dsSinhVien);
  const kq = dsSinhVien.filter(sv =>
    sv.masv.toLowerCase().includes(tk) || sv.hoten.toLowerCase().includes(tk)
  );
  hienThi(kq);
  kq.length === 0 ? baoLoi("Không tìm thấy sinh viên phù hợp.")
                  : baoOK("Tìm thấy " + kq.length + " kết quả.");
}

function xoaTimKiem(){
  document.getElementById("tukhoa").value = "";
  hienThi(dsSinhVien);
}

/* ===== LÀM MỚI FORM ===== */
function lamMoi(){
  ["masv","hoten","lop","dlt","dth"].forEach(id => document.getElementById(id).value = "");
  if (maDangSua) ketThucSua();
  document.getElementById("masv").focus();
}

/* ===== SẮP XẾP KHI BẤM TIÊU ĐỀ CỘT ===== */
const cotSapXep = { 1:"masv", 2:"hoten", 3:"lop", 4:"dlt", 5:"dth", 6:"dtb", 7:"loai" };

function gioiThieuSapXep(){
  document.querySelectorAll("thead th").forEach((th, i) => {
    if (!cotSapXep[i]) return;
    th.classList.add("sort");
    th.onclick = () => {
      const key = cotSapXep[i];
      sapXep.tang = sapXep.cot === key ? !sapXep.tang : true;
      sapXep.cot = key;

      const lay = sv => key === "dtb" ? dtb(sv) : key === "loai" ? dtb(sv) : sv[key];
      const ds = [...dsHienTai].sort((a, b) => {
        const x = lay(a), y = lay(b);
        const r = typeof x === "number" ? x - y : String(x).localeCompare(String(y), "vi");
        return sapXep.tang ? r : -r;
      });

      document.querySelectorAll("thead th").forEach(t => t.classList.remove("tang","giam"));
      th.classList.add(sapXep.tang ? "tang" : "giam");
      hienThi(ds);
    };
  });
}

/* ===== PHÍM TẮT ===== */
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  if (e.target.id === "tukhoa") timKiem();
  else if (["masv","hoten","lop","dlt","dth"].includes(e.target.id)) themSinhVien();
});

// Tìm kiếm ngay khi gõ
document.getElementById("tukhoa").addEventListener("input", function(){
  if (this.value.trim() === "") hienThi(dsSinhVien);
});

/* ===== KHỞI TẠO ===== */
gioiThieuSapXep();
hienThi(dsSinhVien);