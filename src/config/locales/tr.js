import { defineMessages } from "react-intl";

const messages = defineMessages({
  app_name: "Boun Mis Staj Yönetim Sistemi",
  sign_in: "Giriş",
  sign_out: "Çıkış",
  sign_up: "Kayıt ol",
  email: "E-mail",
  username: "kullanıcı adı",
  student: "Öğrenci",
  advisor: "Akademik Danışman",
  headOfDepartment: "Bölüm Başkanlığı",
  internshipManager: "Staj Sorumlusu",
  admin: "Admin",
  complateYourProfile: "Profilini Tamamla",
  save: "Kaydet",
  complateYourProfileText:
    "Uygulamyı kullanabilmek için gerekli profil bilgilerini tamamlamanız gerekmekte. Gireceğiniz bilgiler daha sonra staj işlemlerinizde de kullanılacaktır. Bilgileri her zaman profilim sayfasından güncelleyebilirsiniz.",
  phoneNumber: "Telefon Numarası",
  studentNumber: "Öğrenci Numarası",
  tcNumber: "Tc Kimlik Numarası",
  birthDate: "Doğum Tarihi",
  requiredError: "Lütfen bu alanı doldurun.",
  emailError: "Lütfen geçerli bir mail adresi giriniz.",
  passwordError: "Lütfen geçerli bir parola giriniz.",
  bounEmailError:
    "@boun.edu.tr ile biten bir mail adresi ile giriş yapmanız gerekmektedir.",
  noLetterRequest: "Belge başvurunuz bulunmamakta.",
  companyApprovalText:"Yukarıdaki bahsedilen stajyerin şirketimizde staj yapacağını ve girdiğim bilgilerin doğruluğunu onaylıyorum.",
  FinishedInternships:"Eski Stajlar",
  AddFinishedInternship:"Eski Staj Ekle",
  approvedWorkDayDuration:"Onaylanmış Staj Günleri",
  insuranceStartDate:"Sigorta Başlangıç Tarihi",
  users:"Kullanıcılar",
  InternshipApplicationProcess: "Staj Başvuru Süreci",
  InternshipApplicationForm: "Staj Başvuru Formu",
  studentName: "Adı Soyadı",
  studentEmail: "E-mail",
  doubleMajor: "ÇAP",
  doubleMajorDepartment: "Ana Bölüm",
  studentId: "B.Ü. Öğrenci No",
  semesterCompleted: "Bitirdiği Dönem",
  creditsCompleted: "Tamamladığı Kredi",
  studentTC: "T.C. Kimlik No",
  studentBday: "Doğum Tarihi",
  studentPhone: "Telefon",
  companyName: "İşletme Adı",
  companyAddress: "İşletme Adresi",
  companyPhone: "İşletme Telefon",
  supervisorName: "Staj Sorumlusu Adı Soyadı",
  supervisorEmail: "Staj Sorumlusu E-mail",
  supervisorPhone: "Staj Sorumlusu Telefon",
  saturdayWork: "İşletme Cumartesi açık mı? ",
  internshipDepartment: "Staj Yapılacak Bölümün Adı",
  internshipArea: "Staj Alanı",
  startDate: "Başlangıç Tarihi",
  endDate: "Bitiş Tarihi",
  duration: "Süre(Gün)",
  internshipDescription: "Staj Programı ve Proje Tanımı",
  internResponsibilities: "Stajyerden Beklenen Görevler",
  supportOffered: "Stajyere Verilecek Destek",
  studentDepartment: "Öğrencinin Bölümü",
  companyTaxNo: "İşletme/Firma Vergi No",
  numberOfEmployee: "Firmada Çalışan Personel Sayısı",
  companyBankBranchName: "Firma Banka/Şube Adı",
  companyIbanNo: "Firma Banka İban No",
  feeToStudent: "Stajyere Ödenecek Ücret",
  studentApprovalApplicationForm:"Yukarıdaki bilgilerin doğruluğunu ve bu bilgilerle oluşturulacak staj başvuru belgelerimi onaylıyorum.",
  onGoingApplications:"Devam Eden Başvurular",
  ApplicationForm:"Staj Başvuru Formu",
  noApplicationsFound:"Başvuru bulunamadı.",
  onGoingInternships:"Devam Eden Staj Süreçleri",
  status:"Durum",
  applyDate:"Başvuru tarihi",
  company:"Şirket",
  applicationId:"Başvuru Numarası",
  details:"Detaylar",
  ApplicationDetails:"Staj Başvuru Detayları",
  CompanyApproval:"Şirket Staj Onayı",
  sendCompanyApprovalLink:"Sistem Şirkete Mail Atsın",
  companyApprovalLink:"Şirket Onay Linki",
  workedDayDuration:"Öğrencinin Devam Ettiği Gün Sayısı",
  nonWorkedDayDuration:"Öğrencinin Devam Etmediği Gün Sayısı",
  newSupervisorName: "Staj Sorumlusu Adı",
  newSupervisorEmail: "Staj Sorumlusu E-mail",
  newSupervisorPhone: "Staj Sorumlusu Telefon",
  attendance: "Devam Durumu",
  attendanceComment: "Düşünceler",
  responsibility: "Sorumluluk",
  responsibilityComment: "Düşünceler",
  workPerformance: "İş Başarısı",
  workPerformanceComment: "Düşünceler",
  adaptationToAGivenTask: "İşe Uyum Yeteneği",
  adaptationToAGivenTaskComment: "Düşünceler",
  motivation: "Öğrenme İsteği",
  motivationComment: "Düşünceler",
  abilityOfExpressingHerself: "Öğrenme İsteği",
  abilityOfExpressingHerselfComment: "Düşünceler",
  adaptationToCompanyregulations: "İşyeri Kurallarına Uyumu",
  adaptationToCompanyregulationsComment: "Düşünceler",
  relationsWithOtherPersonnel: "İş İlişkileri",
  relationsWithOtherPersonnelComment: "Düşünceler",
  notes: "Diğer Konular",
  internEvaluationText:"Yukarıdaki bahsedilen stajyerin şirketimizdeki stajını tamamladığını ve girdiğim bilgilerin doğruluğunu onaylıyorum.",
  subject:"Konu",
  badAverageGood:"Yetersiz/Orta/İyi",
  comments:"Düşünceler",
  internEvaluationForm:"Stajyer Değerlendirme Formu",
  confirmationToken:"Doğrulama Kodu",
  companyApproval:"Şirket Onayı",
  addUser:"Kullanıcı Ekle",
  name:"Ad-Soyad",
  advisorApproval:"Danışman Onayı",
  departmentApproval:"Bölüm Onayı",
  intershipManagerApproval:"Staj Sorumlusu Onayı",
  noInternshipsFound:"Onaya Gönderilmiş Staj Bulunamadı.",
  companySector: "İşletmenin Çalışma Alanı",
  numberOfInterns: "Çalışan Stajyer Sayısı",
  companySystemSpecifications: "Kurumdaki Sistem ile İlgili Bilgiler(Donanım/Yazılım/Ağ)",
  descriptionOfProgram : "Öğrenci Tarafından Yapılan Staj Programı Tanımı",
  interestForIntern: "Öğrenci Tarafından YapılanStaj Programı Tanımı",
  companyContribution: "İşletmenin Size Katkıları",
  wouldYouRecommend: "İşletmeyi Staj İçin Önerirmisiniz?",
  companyEvaluationText:"Girdiğim bilgilerin doğruluğunu onaylıyorum.",
  ApprovedInternships:"Onaylanmış Stajlar",
  GeneralInformations: "Genel Bilgiler",
  MandatoryInternshipLetter: "Zorunlu Staj Yazısı",
  CurrentIntership: "Devam Eden Staj Süreçi",
  OldInternships: "Geçmiş Staj Bilgileri",
  Internships:"Stajlarım",
  password: "Şifre",
  about: "Hakkında",
  home: "Ana Sayfa",
  page_not_found: "Sayfa bulunamadı",
  settings: "Ayarlar",
  theme: "Tema",
  default: "Varsayılan",
  red: "Kızmızı",
  green: "Yeşil",
  language: "Dil",
  tr: "Türkçe",
  en: "English",
  menu: "Menü",
  menu_mini_mode: "Mini Menü",
  offline: "Offline",
  demos: "Demolar",
  dialog_demo: "Demo dialog",
  dialog_title: "Dialog title",
  dialog_action: "Evet, Sil",
  dialog_message: `Dialog message. You can put as much text as you want here. 
  Ask a question or show a warning before deleting something. 
  You can also set the action text to something like "YES, Delete" and run that action by passing a "handleAction" prop. 
  This receives a "handleClose" callback with which you can close the dialog when your action is done.`,
  toast_demo: "Demo toast",
  filter_demo: "Demo filter",
  list_page_demo: "List Page demo with {count} rows",
  forgot_password: "Şifremi unuttum",
  password_reset: "Şifre Sıfırla",
  password_confirm: "Şifreyi Doğrula",
  registration: "Kayıt Ol",
  my_account: "Hesabım",
  delete_account_dialog_title: "Hesabı sil?",
  delete_account_dialog_message:
    "Your account will be deleted and you will lose all your data!",
  delete_account_dialog_action: "Delete account",
});

export default messages;
