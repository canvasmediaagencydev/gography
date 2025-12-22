export const THAI_LABELS = {
  // Navigation
  dashboard: 'แดชบอร์ด',
  manageTrips: 'จัดการทริป',
  manageSchedules: 'จัดการรอบเดินทาง',
  manageCountries: 'จัดการประเทศ',
  logout: 'ออกจากระบบ',
  login: 'เข้าสู่ระบบ',

  // Trip fields
  tripTitle: 'ชื่อทริป',
  description: 'รายละเอียด',
  country: 'ประเทศ',
  price: 'ราคาต่อคน',
  tripType: 'ประเภททริป',
  groupTour: 'กรุ๊ปทัวร์',
  privateTour: 'ทริปส่วนตัว',
  coverImage: 'รูปภาพปก',
  documentLink: 'ลิงก์เอกสาร',
  status: 'สถานะ',
  active: 'เปิดใช้งาน',
  inactive: 'ปิดใช้งาน',

  // Schedule fields
  departureDate: 'วันที่เดินทาง',
  returnDate: 'วันที่กลับ',
  registrationDeadline: 'วันปิดรับสมัคร',
  totalSeats: 'จำนวนที่นั่งทั้งหมด',
  availableSeats: 'ที่นั่งว่าง',
  duration: 'ระยะเวลา',
  days: 'วัน',
  nights: 'คืน',

  // Table columns
  tripName: 'ชื่อทริป',
  nextSchedule: 'รอบถัดไป',
  availableSlots: 'ที่ว่าง',
  manage: 'จัดการ',

  // Actions
  create: 'สร้าง',
  createNew: 'สร้างใหม่',
  edit: 'แก้ไข',
  delete: 'ลบ',
  save: 'บันทึก',
  cancel: 'ยกเลิก',
  view: 'ดูรายละเอียด',
  viewDetails: 'ดูรายละเอียด',
  search: 'ค้นหา',
  filter: 'กรอง',
  addSchedule: 'เพิ่มรอบเดินทาง',

  // Form labels
  email: 'อีเมล',
  password: 'รหัสผ่าน',
  fullName: 'ชื่อ-นามสกุล',

  // Messages
  createSuccess: 'สร้างสำเร็จ',
  updateSuccess: 'อัพเดตสำเร็จ',
  deleteSuccess: 'ลบสำเร็จ',
  error: 'เกิดข้อผิดพลาด',
  loading: 'กำลังโหลด...',
  noData: 'ไม่มีข้อมูล',
  confirmDelete: 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้?',

  // Validation
  required: 'กรุณากรอกข้อมูล',
  invalidEmail: 'อีเมลไม่ถูกต้อง',
  invalidFormat: 'รูปแบบไม่ถูกต้อง',
  minLength: 'ต้องมีอักขระอย่างน้อย',
  maxLength: 'ต้องมีอักขระไม่เกิน',

  // Pagination
  page: 'หน้า',
  of: 'จาก',
  itemsPerPage: 'รายการต่อหน้า',
  showing: 'แสดง',
  results: 'ผลลัพธ์',

  // Statistics
  totalTrips: 'ทริปทั้งหมด',
  upcomingSchedules: 'รอบเดินทางที่กำลังมา',
  totalSeatsCount: 'ที่นั่งทั้งหมด',

  // Filters
  allTypes: 'ประเภททริปทั้งหมด',
  allDestinations: 'ทั่วหมด',
  allStatuses: 'สถานะทั้งหมด',

  // Gallery Management
  manageGallery: 'จัดการแกลเลอรี',
  uploadImages: 'อัปโหลดรูปภาพ',
  editImage: 'แก้ไขรูปภาพ',
  imageTitle: 'ชื่อรูปภาพ',
  altText: 'ข้อความ Alt',
  preview: 'ตัวอย่าง',
  highlight: 'ไฮไลท์',
  highlighted: 'ไฮไลท์',
  notHighlighted: 'ไม่ไฮไลท์',
  highlightStatus: 'สถานะไฮไลท์',
  setAsHighlight: 'ตั้งเป็นไฮไลท์',
  orderIndex: 'ลำดับการแสดง',
  linkedTrip: 'เชื่อมโยงกับทริป',
  selectFiles: 'เลือกไฟล์',
  uploading: 'กำลังอัปโหลด',
  upload: 'อัปโหลด',
  back: 'กลับ',
  remove: 'ลบออก',
  totalImages: 'รูปภาพทั้งหมด',
  highlightedImages: 'รูปภาพไฮไลท์',
  imagesByCountry: 'รูปภาพแต่ละประเทศ',
} as const

export type ThaiLabel = keyof typeof THAI_LABELS
