const yup = require('yup')

const _home = ["บ้านส่วนตัว", "บ้านเช่า", "บ้านพักข้าราชการ", "หอพัก", "อื่นๆ"]
const _travel = ["เดินเท้า", "พาหนะไม่เสียค่าโดยสาร", "พาหนะเสียค่าโดยสาร", "จักรยานยืมเรียน"]
const _health = ["ร่างกายปกติ", "มีความบกพร่องทางการมองเห็น", "มีความบกพร่องทางการได้ยิน", "มีความบกพร่องทางสติปัญญา", "มีความบกพร่องทางร่างกาย", "มีปัญหาทางการเรียนรู้", "มีความบกพร่องทางการพูด", "มีปัญหาทาางพฤติกรรม อารมณ์", "ออทิสติก", "พิการซ้อน"]
const _family = ['อยู่ด้วยกัน', 'แยกกันอยู่', 'หย่าร้าง', 'บิดาถึงแก่กรรม', 'มารดาถึงแก่กรรม', 'บิดาและมารดาถึงแก่กรรม', 'บิดาถึงแก่กรรมและมารดาแต่งงานใหม่', 'มารดาถึงแก่กรรมและบิดาแต่งงานใหม่']

const schemaStep1 = yup.object().shape({
    st_id: yup.string().required("กรุณาใส่เลขประจำตัวนักเรียน").typeError("ข้อมูลไม่ถูกต้อง"),
    st_card: yup.string().required("กรุณาใส่เลขประจำตัวประชาชน").test({
        name: 'เลขประจำตัวประชาชน',
        test: (value, { createError }) => {
            return value?.length != 13 ? createError({
                message: 'เลขประจำตัวประชาชนไม่เป็น 13 ตำแหน่ง'
            }) : true
        }
    }),
    st_prefix: yup.string().required("กรุณาระบุคำนำหน้าชื่อ").test({
        name: 'คำนำหน้าชื่อ',
        test: (value, { createError }) => {
            return !["เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"].includes(value || "") ? createError({
                message: 'คำนำหน้าชื่อไม่ถูกต้อง'
            }) : true
        }
    }),
    st_name: yup.string().required("กรุณาใส่ ชื่อ ภาษาไทย").typeError("ข้อมูลไม่ถูกต้อง"),
    st_lastname: yup.string().required("กรุณาใส่ นามสกุล ภาษาไทย").typeError("ข้อมูลไม่ถูกต้อง"),
    st_enname: yup.string().required("กรุณาใส่ ชื่อ ภาษาอังกฤษ").typeError("ข้อมูลไม่ถูกต้อง"),
    st_enlastname: yup.string().required("กรุณาใส่ นามสกุล ภาษาอังกฤษ").typeError("ข้อมูลไม่ถูกต้อง"),
    st_sex: yup.number().required("กรุณาเลือกเพศ").min(0,"กรุณาเลือกเพศ").max(1,"กรุณาเลือกเพศ"),
    st_nation: yup.string().required("กรุณาเลือกสัญชาติ").typeError("ข้อมูลไม่ถูกต้อง"),
    st_origin: yup.string().required("กรุณาเลือกเชื้อชาติ").typeError("ข้อมูลไม่ถูกต้อง"),
    st_religion: yup.string().required("กรุณาเลือกศาสนา").test({
        name: "ศาสนา",
        test: (value, { createError }) => {
            return !['พุทธ', 'คริสต์', 'อิสลาม', 'ฮินดู', 'ศานาอื่นๆ'].includes(value || "") ? createError({
                message: 'ข้อมูลไม่ถูกต้อง'
            }) : true
        }
    }),
    st_blood: yup.string().required("กรุณาเลือกหมู่เลือด").test({
        name: "หมู่เลือด",
        test: (value, { createError }) => {
            return !['A', 'B', 'AB', 'O'].includes(value || "") ? createError({
                message: 'ข้อมูลไม่ถูกต้อง'
            }) : true
        }
    }),
    st_birthdate: yup.string().required("กรุณาเลือกวันเกิด").test({
        name: "วันเกิด",
        test: (value, { createError }) => {
            if (value) {
                let date = new Date(value)
                let now = new Date()
                if (date.getFullYear() >= now.getFullYear()) {
                    return createError({
                        message: 'ข้อมูลไม่ถูกต้อง'
                    })
                }
            } else {
                return createError({
                    message: 'กรุณาเลือกวันเกิด'
                })
            }
            return true
        }
    }),
    birth_province: yup.string().required("กรุณาเลือกจังหวัด").typeError("ข้อมูลไม่ถูกต้อง"),
    st_room: yup.string().required("กรุณาเลือกห้อง").typeError("ข้อมูลไม่ถูกต้อง"),
    class_id: yup.number().required("กรุณาเลือกชั้นเรียน").test({
        name: "ชั้นเรียน",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0 || value >= 6) ? createError({
                message: 'กรุณาเลือกชั้นเรียน'
            }) : true
        }
    }),
    st_mail: yup.string().email("กรุณาใส่อีเมล์ให้ถูกต้อง").required("กรุณาใส่อีเมล์").typeError("ข้อมูลไม่ถูกต้อง"),
    st_mobile: yup.string().required("กรุณาใส่เบอร์โทรศัพท์").test({
        name: "เบอร์โทรศัพท์",
        test: (value, { createError }) => {
            return /\D/.test(value || "") ? createError({
                message: 'ข้อมูลไม่ถูกต้อง'
            }) : true
        }
    }),
})

const schemaStep2 = yup.object().shape({
    st_address: yup.string().required("กรุณากรอกที่อยู่"),
    _is_same: yup.string().required("กรุณาระบุช่องนี้ด้วย").typeError("ข้อมูลไม่ถูกต้อง"),
    home_id: yup.number().required("กรุณาเลือกลักษณะที่อยู่อาศัย").test({
        name: "ลักษณะที่อยู่อาศัย",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0 || value >= _home.length) ? createError({
                message: 'กรุณาเลือกลักษณะที่อยู่อาศัย'
            }) : true
        }
    }),
    province_id: yup.number().required("กรุณาเลือกจังหวัด").test({
        name: "จังหวัด",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกจังหวัด'
            }) : true
        }
    }),
    amphur_id: yup.number().required("กรุณาเลือกอำเภอ").test({
        name: "อำเภอ",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกอำเภอ'
            }) : true
        }
    }),
    district_id: yup.number().required("กรุณาเลือกตำบล").test({
        name: "ตำบล",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกตำบล'
            }) : true
        }
    }),
    province_id_now: yup.number().required("กรุณาเลือกจังหวัด").test({
        name: "จังหวัด",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกจังหวัด'
            }) : true
        }
    }),
    amphur_id_now: yup.number().required("กรุณาเลือกอำเภอ").test({
        name: "อำเภอ",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกอำเภอ'
            }) : true
        }
    }),
    district_id_now: yup.number().required("กรุณาเลือกตำบล").test({
        name: "ตำบล",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกตำบล'
            }) : true
        }
    }),

    st_post_now: yup.string().required("กรุณาระบุรหัสไปรษณีย์").typeError("ข้อมูลไม่ถูกต้อง"),
    st_latitude: yup.string().required("กรุณาระบุละติจูด").typeError("ข้อมูลไม่ถูกต้อง"),
    st_longitude: yup.string().required("กรุณาระบุลองจิจูด").typeError("ข้อมูลไม่ถูกต้อง"),
    travel_id: yup.number().required("กรุณาระบุวิธีการเดินทางมาโรงเรียน").test({
        name: "วิธีการเดินทางมาโรงเรียน",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0 || value >= _travel.length) ? createError({
                message: 'กรุณาเลือกวิธีการเดินทางมาโรงเรียน'
            }) : true
        }
    }),
    travel_time: yup.number().required("กรุณาระบุเวลาที่เดินทาง").min(1, "กรุณาระบุเวลาที่เดินทาง").typeError("ข้อมูลไม่ถูกต้อง"),
    travel_length: yup.number().required("กรุณาระบุระยะทาง").min(1, "กรุณาระบุระยะทาง").typeError("ข้อมูลไม่ถูกต้อง"),
    st_money: yup.number().required("กรุณาระบุจำนวนเงิน").min(1, "กรุณาระบุจำนวนเงิน").typeError("ข้อมูลไม่ถูกต้อง"),
    health_id: yup.number().required("กรุณาระบุสุขภาพ").test({
        name: "สุขภาพ",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0 || value >= _health.length) ? createError({
                message: 'กรุณาเลือกสุขภาพ'
            }) : true
        }
    }),
    st_weight: yup.number().required("กรุณาระบุน้ำหนัก").min(1, "กรุณาระบุน้ำหนัก").typeError("ข้อมูลไม่ถูกต้อง"),
    st_high: yup.number().required("กรุณาระบุส่วนสูง").min(1, "กรุณาระบุส่วนสูง").typeError("ข้อมูลไม่ถูกต้อง"),
    school_name: yup.string().required("กรุณาระบุชื่อโรงเรียน").max(250, "กรุณาระบุชื่อโรงเรียน").typeError("ข้อมูลไม่ถูกต้อง"),
    school_province: yup.number().required("กรุณาเลือกจังหวัด").test({
        name: "จังหวัด",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกจังหวัด'
            }) : true
        }
    }),
    school_amphur: yup.number().required("กรุณาเลือกอำเภอ").test({
        name: "อำเภอ",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0) ? createError({
                message: 'กรุณาเลือกอำเภอ'
            }) : true
        }
    }),
})

const schemaStep3 = yup.object().shape({
    family_id: yup.number().required("กรุณาเลือกสถานภาพ").test({
        name: "สถานภาพ",
        test: (value, { createError }) => {
            value = value !== undefined ? value : -1
            return (value < 0 || value >= _family.length) ? createError({
                message: 'กรุณาเลือกสถานภาพ'
            }) : true
        }
    }),
    older_brather: yup.number().min(0, "กรุณากรอกจำนวนพี่ชาย").required("กรุณากรอกจำนวนพี่ชาย"),
    young_brather: yup.number().min(0, "กรุณากรอกจำนวนน้องชาย").required("กรุณากรอกจำนวนน้องชาย"),
    older_sister: yup.number().min(0, "กรุณากรอกจำนวนพี่สาว").required("กรุณากรอกจำนวนพี่สาว"),
    young_sister: yup.number().min(0, "กรุณากรอกจำนวนน้องสาว").required("กรุณากรอกจำนวนน้องสาว"),
    my_self: yup.number().min(0, "กรุณากรอกลำดับที่เกิด").required("กรุณากรอกลำดับที่เกิด"),
    father_card: yup.string().test({
        name: 'เลขประจำตัวประชาชน',
        test: (value, { createError }) => {
            return value?.length != 13 && value !== "" ? createError({
                message: 'เลขประจำตัวประชาชนไม่เป็น 13 ตำแหน่ง'
            }) : true
        }
    }),
    mother_card: yup.string().test({
        name: 'เลขประจำตัวประชาชน',
        test: (value, { createError }) => {
            return value?.length != 13 && value !== "" ? createError({
                message: 'เลขประจำตัวประชาชนไม่เป็น 13 ตำแหน่ง'
            }) : true
        }
    }),
    parent_card: yup.string().test({
        name: 'เลขประจำตัวประชาชน',
        test: (value, { createError }) => {
            return value?.length != 13 && value !== "" ? createError({
                message: 'เลขประจำตัวประชาชนไม่เป็น 13 ตำแหน่ง'
            }) : true
        }
    }),
})

module.exports = {
    registerValidator: schemaStep1.concat(schemaStep2).concat(schemaStep3)
}