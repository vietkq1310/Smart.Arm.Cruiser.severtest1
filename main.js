// ------------------------------------------------------------ Phần cài đặt 1 ------------------------------------------------//
const tabs = document.querySelectorAll(".sidebar ul li");
const sections = document.querySelectorAll(".content-section");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Xoá class active khỏi tất cả tab và section
    tabs.forEach((t) => t.classList.remove("active"));
    sections.forEach((s) => s.classList.remove("active"));

    // Thêm class active vào tab được nhấn và section tương ứng
    tab.classList.add("active");
    const target = tab.getAttribute("data-target");
    document.getElementById(target).classList.add("active");
  });
});

// hiển thị icon sáng tối
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

themeToggle.addEventListener("change", function () {
  if (this.checked) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
});

// Thêm các mũi tên để chỉnh số trong cài đặt
//
let set_device = 0; // Biến để lưu giá trị tùy chọn

// Biến lưu trữ cho từng select
let set_ghcar_device = 0;
let set_lcghcar_device = 0;
let set_gharm_device = 0;

document.addEventListener("DOMContentLoaded", function () {
  // Hàm khởi tạo các custom select
  function initCustomSelect(customSelectId, storageKey, set_device_variable) {
    var customSelect = document.getElementById(customSelectId);
    var selected = customSelect.querySelector(".select-selected");
    var options = customSelect.querySelectorAll(".select-items div");
    var items = customSelect.querySelector(".select-items");

    // Lấy lựa chọn từ localStorage nếu có
    var savedOption = localStorage.getItem(storageKey);

    if (savedOption) {
      // Tìm và khôi phục tùy chọn đã lưu
      options.forEach(function (option) {
        if (option.getAttribute("data-value") === savedOption) {
          selected.innerHTML = option.innerHTML;
          option.classList.add("same-as-selected");
          set_device_variable = option.getAttribute("data-index"); // Gán giá trị set_device
          console.log(
            storageKey + " restored set_device =",
            set_device_variable
          );
        }
      });
    }

    // Mở dropdown khi nhấp vào selected
    selected.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn không cho sự kiện click lan truyền lên document
      items.style.display = items.style.display === "block" ? "none" : "block";
    });

    // Xử lý khi chọn một tùy chọn
    options.forEach(function (option) {
      option.addEventListener("click", function () {
        selected.innerHTML = this.innerHTML; // Cập nhật tùy chọn được chọn
        options.forEach(function (opt) {
          opt.classList.remove("same-as-selected");
        });
        this.classList.add("same-as-selected");

        // Lưu lựa chọn vào localStorage
        var selectedOption = this.getAttribute("data-value");
        localStorage.setItem(storageKey, selectedOption);

        set_device_variable = this.getAttribute("data-index"); // Gán giá trị set_device
        console.log(storageKey + " set_device =", set_device_variable); // In ra giá trị để kiểm tra

        items.style.display = "none"; // Ẩn dropdown sau khi chọn
      });
    });

    // Đóng dropdown nếu click ra ngoài
    document.addEventListener("click", function () {
      items.style.display = "none";
    });
  }

  // Khởi tạo các custom select và gán biến tương ứng
  initCustomSelect("customSelect", "selectedOption", set_device);
  initCustomSelect(
    "customSelect_ghcar",
    "selectedOption_ghcar",
    set_ghcar_device
  );
  initCustomSelect(
    "customSelect_lcghcar",
    "selectedOption_lcghcar",
    set_lcghcar_device
  );
  initCustomSelect(
    "customSelect_gharm",
    "selectedOption_gharm",
    set_gharm_device
  );
});

// ------------------------------------------------------------ Phần điều khiển 1 ------------------------------------------------//
//
// Thêm sự kiện cho các công tắc bật/tắt
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const id = event.target.id;
    const state = event.target.checked ? "ON" : "OFF";
    sendSwitchState(id, state);
  });
});

// Thêm sự kiện cho các nút nhấn
document
  .querySelectorAll(
    ".fa-circle-chevron-up, .fa-circle-chevron-down, .fa-circle-chevron-right, .fa-circle-chevron-left"
  )
  .forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.target.classList.contains("buttons_1lu")
        ? "CAR_UP"
        : event.target.classList.contains("buttons_1ld")
        ? "CAR_DOWN"
        : event.target.classList.contains("buttons_1lr")
        ? "CAR_RIGHT"
        : event.target.classList.contains("buttons_1ll")
        ? "CAR_LEFT"
        : event.target.classList.contains("buttons_2lr")
        ? "CAR_ROTATE_RIGHT"
        : event.target.classList.contains("buttons_2ll")
        ? "CAR_ROTATE_LEFT"
        : event.target.classList.contains("buttons_1ru")
        ? "Step_X+"
        : event.target.classList.contains("buttons_1rd")
        ? "Step_X-"
        : event.target.classList.contains("buttons_1rr")
        ? "Step_Y+"
        : event.target.classList.contains("buttons_1rl")
        ? "Step_Y-"
        : event.target.classList.contains("buttons_2rr")
        ? "Step_Z+"
        : event.target.classList.contains("buttons_2rl")
        ? "Step_Z-"
        : "UNKNOWN";

      sendData(action);
    });
  });

function sendData(action) {
  if (webSocket.readyState === WebSocket.OPEN) {
    let command;
    switch (action) {
      case "LEFT2":
        command = "turn left";
        break;
      case "RIGHT2":
        command = "turn right";
        break;
      default:
        command = action;
    }
    sendCommand(command);
  } else {
    console.log("WebSocket is not open.");
  }
}

// ----------------------------------------------------------- Xử lý tác vụ khi nhấn vào phần Narbar -----------------------------------------------------------------//
const user_layout = document.querySelector(".user_layout");
const open_navbar = document.querySelector(".open_navbar");

open_navbar.onclick = function () {
  user_layout.classList.toggle("Open_navbar");
  open_navbar.classList.toggle("Close_navbar");
};

const Column_1 = document.querySelector(".Column_1");
const arrow_narbar_C = document.querySelector(".arrow_narbar_C");

arrow_narbar_C.onclick = function () {
  Column_1.classList.toggle("Open_navbar_C");
  arrow_narbar_C.classList.toggle("Close_navbar_C");
};

const Column_5 = document.querySelector(".Column_5");
const arrow_narbar_C1 = document.querySelector(".arrow_narbar_C1");

arrow_narbar_C1.onclick = function () {
  Column_5.classList.toggle("Open_navbar_C1");
  arrow_narbar_C1.classList.toggle("Close_navbar_C1");
};

// Mở toàn bộ màn hình
document
  .getElementById("fullscreen-btn")
  .addEventListener("click", function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Không thể mở toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

// Hàm đóng tất cả các cửa sổ modal
function closeAllModals() {
  document.getElementById("banner").style.display = "none";
  document.getElementById("Control_modal").style.display = "none";
  document.getElementById("Setting_modal").style.display = "none";
}

// Mở cửa sổ modal Home và đóng các cửa sổ modal khác
function openHome() {
  closeAllModals();
  document.getElementById("banner").style.display = "flex";
}

// Mở cửa sổ modal Control và đóng các cửa sổ modal khác
function openControl() {
  closeAllModals();
  document.getElementById("Control_modal").style.display = "flex";
}

// Mở cửa sổ modal Setting và đóng các cửa sổ modal khác
function openModal() {
  closeAllModals();
  document.getElementById("Setting_modal").style.display = "flex";
}

// Đóng cửa sổ modal Home
function closeHome() {
  document.getElementById("banner").style.display = "none";
}

// Đóng cửa sổ modal Control
function closeControl() {
  document.getElementById("Control_modal").style.display = "none";
  closeModal();
}

// Đóng cửa sổ modal Setting
function closeModal() {
  document.getElementById("Setting_modal").style.display = "none";
}

const navbar_commend = document.querySelector(".navbar_commend");
const arrow_menus = document.querySelector(".arrow_menus");

arrow_menus.onclick = function () {
  navbar_commend.classList.toggle("hide-control");
  arrow_menus.classList.toggle("open-control");
};

// Hàm chọn tùy chọn
function selectOption(option) {
  document.getElementById("selected-option").textContent = option;
  document.getElementById("dropdown-toggle").checked = false; // Đóng dropdown
}

// Ẩn dropdown khi nhấn ra ngoài
document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".dropdown");
  const toggle = document.getElementById("dropdown-toggle");
  if (!dropdown.contains(event.target) && toggle.checked) {
    toggle.checked = false; // Đóng dropdown nếu nhấn ra ngoài
  }
});
// Giả lập việc lưu cài đặt
function saveSettings() {
  alert("Settings saved!");
  closeModal();
}

// ------------------------------------------------------------ Gửi giá trị từ wed về để điều khiển xe (ESP32-S3) ------------------------------------------------//

let webSocket;
const ipBtn = document.getElementById("ipBtn");
const controlBtn = document.getElementById("controlBtn");
const statusDiv = document.getElementById("status");
const ipInput = document.getElementById("ipInput");
const errorMessage = document.getElementById("errorMessage");

// Hàm kiểm tra định dạng IP
function isValidIP(ip) {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

// Sự kiện lắng nghe cho ô nhập địa chỉ IP
ipInput.addEventListener("input", () => {
  errorMessage.style.display = "none"; // Ẩn thông báo lỗi khi người dùng nhập
});

// Sự kiện lắng nghe cho nút IP
ipBtn.addEventListener("click", () => {
  const ipAddress = ipInput.value;

  // Kiểm tra địa chỉ IP có hợp lệ không
  if (!isValidIP(ipAddress)) {
    ipInput.classList.remove("valid");
    ipInput.classList.add("invalid");
    errorMessage.style.display = "block";
    return;
  }

  ipInput.classList.remove("invalid");
  ipInput.classList.add("valid");
  errorMessage.style.display = "none";

  const wsUrl = `ws://${ipAddress}:81/`;
  webSocket = new WebSocket(wsUrl);

  webSocket.onopen = () => {
    statusDiv.textContent = "Status: Connected";
    controlBtn.disabled = false;
    console.log("WebSocket is connected.");
  };

  webSocket.onmessage = (event) => {
    console.log("Received:", event.data);
  };

  webSocket.onclose = () => {
    statusDiv.textContent = "Status: Disconnected";
    controlBtn.disabled = true;
    console.log("WebSocket is disconnected.");
  };

  webSocket.onerror = (error) => {
    console.error("WebSocket Error: ", error);
    statusDiv.textContent = "Status: Error";
  };
});

// Sự kiện lắng nghe cho nút điều khiển
controlBtn.addEventListener("click", () => {
  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    sendCommand("start_control");
    console.log("Sent command: start_control");
  } else {
    console.log("WebSocket is not open.");
  }
});

// Hàm gửi lệnh
function sendCommand(command) {
  if (webSocket.readyState === WebSocket.OPEN) {
    webSocket.send(command);
    console.log(`Sent command: ${command}`);
  } else {
    console.log("WebSocket is not open.");
  }
}

// Hàm gửi trạng thái công tắc
function sendSwitchState(id, state) {
  const command = `${id}:${state}`;
  sendCommand(command);
}
// ------------------------------------------------------- Xử lý tác vụ khi nhấn vào phần thông tin  -------------------------------------------------------------//

function openInfo() {
  document.getElementById("").style.display = "";
}

function closeInfo() {
  document.getElementById("").style.display = "";
}

// ========================================== Phần điều khiển chính ==============================================//
function initializeJoystick(joystickId, containerId, outputId) {
  const joystick = document.getElementById(joystickId);
  const container_joy = document.getElementById(containerId);
  const output = document.getElementById(outputId);

  function getContainerRect() {
    return container_joy.getBoundingClientRect();
  }

  function setJoystickPosition(x, y) {
    joystick.style.left = `${x}px`;
    joystick.style.top = `${y}px`;
  }

  function getJoystickCenterPosition() {
    const rect = getContainerRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    return {
      x: centerX,
      y: centerY,
    };
  }

  function updateOutput(dx, dy) {
    output.textContent = `X: ${dx.toFixed(2)}, Y: ${dy.toFixed(2)}`;
  }

  let isDragging = false;

  joystick.addEventListener("mousedown", function (event) {
    isDragging = true;
  });

  document.addEventListener("mouseup", function (event) {
    if (isDragging) {
      isDragging = false;
      const { x, y } = getJoystickCenterPosition();
      setJoystickPosition(x, y);
      updateOutput(0, 0);
    }
  });

  document.addEventListener("mousemove", function (event) {
    if (!isDragging) return;

    const rect = getContainerRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = rect.width / 2 - joystick.offsetWidth / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) {
      const angle = Math.atan2(dy, dx);
      setJoystickPosition(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
    } else {
      setJoystickPosition(x, y);
    }

    updateOutput(dx, dy);
  });

  // Initialize joystick to center
  const { x, y } = getJoystickCenterPosition();
  setJoystickPosition(x, y);
}

window.onload = function () {
  initializeJoystick("joystick1", "joystick-container1", "output1");
  initializeJoystick("joystick2", "joystick-container2", "output2");
};

document.getElementById("servo").addEventListener("click", function () {
  // Thay đổi màu nền
  document.getElementById("servo").classList.add("active");
  document.getElementById("suctionCup").classList.remove("active");

  // Hiển thị nội dung tương ứng
  document.querySelector(".Content_S").classList.add("active");
  document.querySelector(".Content_SC").classList.remove("active");
});

document.getElementById("suctionCup").addEventListener("click", function () {
  // Thay đổi màu nền
  document.getElementById("suctionCup").classList.add("active");
  document.getElementById("servo").classList.remove("active");

  // Hiển thị nội dung tương ứng
  document.querySelector(".Content_SC").classList.add("active");
  document.querySelector(".Content_S").classList.remove("active");
});

// ------------------------- Phần hiển thị hướng di chuyển của xe ---------------------//
let X = 0;
let Y = -1;
let Z = 0;

// Bạn có thể sử dụng điều kiện hoặc logic khác để cập nhật mũi tên hiển thị dựa trên X và Y
document
  .querySelectorAll(".arrow")
  .forEach((arrow) => (arrow.style.display = "none"));

if (X === 0 && Y === -1) {
  document.querySelector(".arrow.up").style.display = "block";
  document.querySelector(".arrow.up-right").style.display = "block";
  document.querySelector(".arrow.right").style.display = "block";
  document.querySelector(".arrow.down-right").style.display = "block";
  document.querySelector(".arrow.down").style.display = "block";
  document.querySelector(".arrow.down-left").style.display = "block";
  document.querySelector(".arrow.left").style.display = "block";
  document.querySelector(".arrow.up-left").style.display = "block";
  document.querySelector(".arrow.tunr-right").style.display = "block";
  document.querySelector(".arrow.tunr-left").style.display = "block";
}
// if (X === 0 && Y === -1) {
//   document.querySelector(".arrow.up").style.display = "block";
// } else if (X === 1 && Y === -1) {
//   document.querySelector(".arrow.up-right").style.display = "block";
// } else if (X === 1 && Y === 0) {
//   document.querySelector(".arrow.right").style.display = "block";
// } else if (X === 1 && Y === 1) {
//   document.querySelector(".arrow.down-right").style.display = "block";
// } else if (X === 0 && Y === 1) {
//   document.querySelector(".arrow.down").style.display = "block";
// } else if (X === -1 && Y === 1) {
//   document.querySelector(".arrow.down-left").style.display = "block";
// } else if (X === -1 && Y === 0) {
//   document.querySelector(".arrow.left").style.display = "block";
// } else if (X === -1 && Y === -1) {
//   document.querySelector(".arrow.up-left").style.display = "block";
// } else if (Z === 1) {
//   document.querySelector(".arrow.tunr-right").style.display = "block";
// } else if (Z === -1) {
//   document.querySelector(".arrow.tunr-left").style.display = "block";
// }

// phần cột 1
// Code for box1
var numbers1 = document.getElementById("box1");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers1.appendChild(span);
}
var num1 = numbers1.getElementsByTagName("span");
var index1 = 0;
function nextNum1() {
  num1[index1].style.display = "none";
  index1 = (index1 + 1) % num1.length;
  num1[index1].style.display = "initial";
}
function prevNum1() {
  num1[index1].style.display = "none";
  index1 = (index1 - 1 + num1.length) % num1.length;
  num1[index1].style.display = "initial";
}

// Code for box2
var numbers2 = document.getElementById("box2");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers2.appendChild(span);
}
var num2 = numbers2.getElementsByTagName("span");
var index2 = 0;
function nextNum2() {
  num2[index2].style.display = "none";
  index2 = (index2 + 1) % num2.length;
  num2[index2].style.display = "initial";
}
function prevNum2() {
  num2[index2].style.display = "none";
  index2 = (index2 - 1 + num2.length) % num2.length;
  num2[index2].style.display = "initial";
}

// Code for box3
var numbers3 = document.getElementById("box3");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers3.appendChild(span);
}
var num3 = numbers3.getElementsByTagName("span");
var index3 = 0;
function nextNum3() {
  num3[index3].style.display = "none";
  index3 = (index3 + 1) % num3.length;
  num3[index3].style.display = "initial";
}
function prevNum3() {
  num3[index3].style.display = "none";
  index3 = (index3 - 1 + num3.length) % num3.length;
  num3[index3].style.display = "initial";
}

// Code for box4
var numbers4 = document.getElementById("box4");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers4.appendChild(span);
}
var num4 = numbers4.getElementsByTagName("span");
var index4 = 0;
function nextNum4() {
  num4[index4].style.display = "none";
  index4 = (index4 + 1) % num4.length;
  num4[index4].style.display = "initial";
}
function prevNum4() {
  num4[index4].style.display = "none";
  index4 = (index4 - 1 + num4.length) % num4.length;
  num4[index4].style.display = "initial";
}

// Code for box5
var numbers5 = document.getElementById("box5");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers5.appendChild(span);
}
var num5 = numbers5.getElementsByTagName("span");
var index5 = 0;
function nextNum5() {
  num5[index5].style.display = "none";
  index5 = (index5 + 1) % num5.length;
  num5[index5].style.display = "initial";
}
function prevNum5() {
  num5[index5].style.display = "none";
  index5 = (index5 - 1 + num5.length) % num5.length;
  num5[index5].style.display = "initial";
}

// Code for box6
var numbers6 = document.getElementById("box6");
for (var i = 0; i < 100; i++) {
  var span = document.createElement("span");
  span.textContent = i;
  numbers6.appendChild(span);
}
var num6 = numbers6.getElementsByTagName("span");
var index6 = 0;
function nextNum6() {
  num6[index6].style.display = "none";
  index6 = (index6 + 1) % num6.length;
  num6[index6].style.display = "initial";
}
function prevNum6() {
  num6[index6].style.display = "none";
  index6 = (index6 - 1 + num6.length) % num6.length;
  num6[index6].style.display = "initial";
}
//
//
// Phần tùy chỉnh các số trong cài đặt
// Hàm dùng chung để tăng giảm giá trị
function incrementValue(inputElement) {
  inputElement.value = parseInt(inputElement.value) + 1;
}

function decrementValue(inputElement) {
  inputElement.value = parseInt(inputElement.value) - 1;
}

// Hàm lưu giá trị cho các cảm biến khoảng cách
function saveDistanceValues() {
  const frontDistance = parseInt(
    document.getElementById("front-distance-input").value
  );
  const backDistance = parseInt(
    document.getElementById("back-distance-input").value
  );
  const rightDistance = parseInt(
    document.getElementById("right-distance-input").value
  );
  const leftDistance = parseInt(
    document.getElementById("left-distance-input").value
  );

  console.log("Khoảng cách cảm biến phía trước:", frontDistance, "mm");
  console.log("Khoảng cách cảm biến phía sau:", backDistance, "mm");
  console.log("Khoảng cách cảm biến bên phải:", rightDistance, "mm");
  console.log("Khoảng cách cảm biến bên trái:", leftDistance, "mm");
}

// Gán sự kiện cho khoảng cách phía trước
document
  .querySelector(".increment-front-distance")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("front-distance-input"));
    saveDistanceValues();
  });
document
  .querySelector(".decrement-front-distance")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("front-distance-input"));
    saveDistanceValues();
  });

// Gán sự kiện cho khoảng cách phía sau
document
  .querySelector(".increment-back-distance")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("back-distance-input"));
    saveDistanceValues();
  });
document
  .querySelector(".decrement-back-distance")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("back-distance-input"));
    saveDistanceValues();
  });

// Gán sự kiện cho khoảng cách bên phải
document
  .querySelector(".increment-right-distance")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("right-distance-input"));
    saveDistanceValues();
  });
document
  .querySelector(".decrement-right-distance")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("right-distance-input"));
    saveDistanceValues();
  });

// Gán sự kiện cho khoảng cách bên trái
document
  .querySelector(".increment-left-distance")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("left-distance-input"));
    saveDistanceValues();
  });
document
  .querySelector(".decrement-left-distance")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("left-distance-input"));
    saveDistanceValues();
  });

// Lắng nghe sự kiện 'input' để tự động lưu khi người dùng thay đổi giá trị
document
  .getElementById("front-distance-input")
  .addEventListener("input", saveDistanceValues);
document
  .getElementById("back-distance-input")
  .addEventListener("input", saveDistanceValues);
document
  .getElementById("right-distance-input")
  .addEventListener("input", saveDistanceValues);
document
  .getElementById("left-distance-input")
  .addEventListener("input", saveDistanceValues);

// ------------------------------------------------------------ Phần cài đặt 2 ------------------------------------------------//
// Hàm lưu giá trị cho cả Car và Arm
function saveValues(type) {
  if (type === "Car") {
    const speedMaxCar = parseInt(
      document.getElementById("speed_max-input_Car").value
    );
    const accelerationCar = parseInt(
      document.getElementById("acceleration-input_Car").value
    );
    const speedCar = parseInt(document.getElementById("speed-input_Car").value);
    console.log("Car - Tốc độ tối đa:", speedMaxCar);
    console.log("Car - Gia tốc tối đa:", accelerationCar);
    console.log("Car - Tốc độ di chuyển:", speedCar);
  } else if (type === "Arm") {
    const speedMaxArm = parseInt(
      document.getElementById("speed_max-input_Arm").value
    );
    const accelerationArm = parseInt(
      document.getElementById("acceleration-input_Arm").value
    );
    const speedArm = parseInt(document.getElementById("speed-input_Arm").value);
    console.log("Arm - Tốc độ tối đa:", speedMaxArm);
    console.log("Arm - Gia tốc tối đa:", accelerationArm);
    console.log("Arm - Tốc độ di chuyển:", speedArm);
  }
}

// Gán sự kiện cho Car
document
  .querySelector(".Car_increment-speed_max")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("speed_max-input_Car"));
    saveValues("Car");
  });
document
  .querySelector(".Car_decrement-speed_max")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("speed_max-input_Car"));
    saveValues("Car");
  });

document
  .querySelector(".Car_increment-acceleration")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("acceleration-input_Car"));
    saveValues("Car");
  });
document
  .querySelector(".Car_decrement-acceleration")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("acceleration-input_Car"));
    saveValues("Car");
  });

document.querySelector(".Car_increment-speed").addEventListener("click", () => {
  incrementValue(document.getElementById("speed-input_Car"));
  saveValues("Car");
});
document.querySelector(".Car_decrement-speed").addEventListener("click", () => {
  decrementValue(document.getElementById("speed-input_Car"));
  saveValues("Car");
});

// Gán sự kiện cho Arm
document
  .querySelector(".Arm_increment-speed_max")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("speed_max-input_Arm"));
    saveValues("Arm");
  });
document
  .querySelector(".Arm_decrement-speed_max")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("speed_max-input_Arm"));
    saveValues("Arm");
  });

document
  .querySelector(".Arm_increment-acceleration")
  .addEventListener("click", () => {
    incrementValue(document.getElementById("acceleration-input_Arm"));
    saveValues("Arm");
  });
document
  .querySelector(".Arm_decrement-acceleration")
  .addEventListener("click", () => {
    decrementValue(document.getElementById("acceleration-input_Arm"));
    saveValues("Arm");
  });

document.querySelector(".Arm_increment-speed").addEventListener("click", () => {
  incrementValue(document.getElementById("speed-input_Arm"));
  saveValues("Arm");
});
document.querySelector(".Arm_decrement-speed").addEventListener("click", () => {
  decrementValue(document.getElementById("speed-input_Arm"));
  saveValues("Arm");
});

// Lắng nghe sự kiện 'input' cho Car
document
  .getElementById("speed_max-input_Car")
  .addEventListener("input", () => saveValues("Car"));
document
  .getElementById("acceleration-input_Car")
  .addEventListener("input", () => saveValues("Car"));
document
  .getElementById("speed-input_Car")
  .addEventListener("input", () => saveValues("Car"));

// Lắng nghe sự kiện 'input' cho Arm
document
  .getElementById("speed_max-input_Arm")
  .addEventListener("input", () => saveValues("Arm"));
document
  .getElementById("acceleration-input_Arm")
  .addEventListener("input", () => saveValues("Arm"));
document
  .getElementById("speed-input_Arm")
  .addEventListener("input", () => saveValues("Arm"));

// Lắng nghe sự kiện 'input' để tự động lưu khi người dùng thay đổi giá trị
speedMaxInputCar.addEventListener("input", saveCarValues);
accelerationInputCar.addEventListener("input", saveCarValues);
speedInputCar.addEventListener("input", saveCarValues);
//
//
// ------------------------------------------------------------ Phần điều khiển 2 ------------------------------------------------//
document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();
  switch (key) {
    // Nút cột 2
    case "w":
      console.log("Lên");
      highlightButton("buttons_1lu");
      break;
    case "s":
      console.log("Xuống");
      highlightButton("buttons_1ld");
      break;
    case "a":
      console.log("Trái");
      highlightButton("buttons_1ll");
      break;
    case "d":
      console.log("Phải");
      highlightButton("buttons_1lr");
      break;
    case "z":
      console.log("Trái 2");
      highlightButton("buttons_2ll");
      break;
    case "c":
      console.log("Phải 2");
      highlightButton("buttons_2lr");
      break;

    // Nút cột 4
    case "arrowup":
      console.log("Lên");
      highlightButton("buttons_1ru");
      break;
    case "arrowdown":
      console.log("Xuống");
      highlightButton("buttons_1rd");
      break;
    case "arrowleft":
      console.log("Trái");
      highlightButton("buttons_1rl");
      break;
    case "arrowright":
      console.log("Phải");
      highlightButton("buttons_1rr");
      break;
    case "b":
      console.log("Trái 2");
      highlightButton("buttons_2rl");
      break;
    case "m":
      console.log("Phải 2");
      highlightButton("buttons_2rr");
      break;
  }
});

function highlightButton(className) {
  const button = document.querySelector(`.${className}`);
  if (button) {
    console.log(`Highlighting button with class: ${className}`);
    button.style.color = "#24c48e"; // Đổi màu khi nhấn phím
    setTimeout(() => {
      button.style.color = ""; // Trở về màu gốc sau 200ms
    }, 200);
  } else {
    console.log(`Button with class ${className} not found.`);
  }
}

// Thêm sự kiện cho các nút nhấn
document
  .querySelectorAll(
    ".fa-circle-chevron-up, .fa-circle-chevron-down, .fa-circle-chevron-right, .fa-circle-chevron-left"
  )
  .forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.target.classList.contains("buttons_1lu")
        ? "CAR_UP"
        : event.target.classList.contains("buttons_1ld")
        ? "CAR_DOWN"
        : event.target.classList.contains("buttons_1lr")
        ? "CAR_RIGHT"
        : event.target.classList.contains("buttons_1ll")
        ? "CAR_LEFT"
        : event.target.classList.contains("buttons_2lr")
        ? "CAR_ROTATE_RIGHT"
        : event.target.classList.contains("buttons_2ll")
        ? "CAR_ROTATE_LEFT"
        : event.target.classList.contains("buttons_1ru")
        ? "Step_X+"
        : event.target.classList.contains("buttons_1rd")
        ? "Step_X-"
        : event.target.classList.contains("buttons_1rr")
        ? "Step_Y+"
        : event.target.classList.contains("buttons_1rl")
        ? "Step_Y-"
        : event.target.classList.contains("buttons_2rr")
        ? "Step_Z+"
        : event.target.classList.contains("buttons_2rl")
        ? "Step_Z-"
        : "UNKNOWN";
      sendData(action);
    });
  });

// Phần cột giữa trong phần hiển thị chính
// Giá trị của x, y, và z
var connects = 0; // Giá trị của trạng thái kết nối
var StatusA = 0; // Giá trị của trạng thái arm
var StatusC = 1; // Giá trị của trạng thái car

// Cập nhật trạng thái kết nối
var connectStatus = document.getElementById("connectStatus");
var connectText = document.getElementById("connectText");

if (connects === 0) {
  connectText.className = "status-text";
  connectText.innerText = "Connect";
  connectStatus.classList.add("connected");
  connectStatus.classList.remove("disconnected");
} else {
  connectText.className = "status-text";
  connectText.innerText = "Disconnect";
  connectStatus.classList.add("disconnected");
  connectStatus.classList.remove("connected");
}

// Cập nhật trạng thái arm
var armStatus = document.getElementById("armStatus");
if (StatusA === 0) {
  armStatus.innerText = "đang chạy";
} else if (StatusA === 1) {
  armStatus.innerText = "đang dừng";
} else if (StatusA === 2) {
  armStatus.innerHTML =
    '<i class=" fa-solid fa-triangle-exclamation warning-icon"></i>     khoảng cách nguy hiểm';
}

// Cập nhật trạng thái car
var carStatus = document.getElementById("carStatus");
if (StatusC === 0) {
  carStatus.innerText = "đang chạy";
} else if (StatusC === 1) {
  carStatus.innerText = "đang dừng";
} else if (StatusC === 2) {
  carStatus.innerHTML =
    '<i class="fa-solid fa-triangle-exclamation warning-icon "></i>     khoảng cách nguy hiểm';
}

/////
