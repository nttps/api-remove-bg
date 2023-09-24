# การใช้งาน Express with remove 
## ความต้องการ

python
nodejs



## ติดตั้ง Python บนเครื่องเซิฟ หรือเครื่องที่ใช้งานบน Windows หรือ MacOS

### Step 1: Download The Installer

ดาวน์โหลดที่เว็บไซต์ [https://python.org/](https://python.org/):
ดาวน์โหลดเวอร์ชั่นล่าสุด


### Step 2: ติดตั้งไฟล์ Setup
แนะนำให้คลิกที่ Disable path length limit ก่อนปิดการติดตั้ง เมื้อสำเร็จจะขึ้นหน้าจอติดตั้งสมบูรณ์


## ติดตั้งโดยเครื่อง Linux หรือ Ubuntu

```bash
lsb_release -a
```

Ubuntu 18.04, Ubuntu 20.04 and above: Python 3.8 doesn’t come by default on Ubuntu 18.04 and above, but it is available in the Universe repository. To install version 3.8, open a terminal application and type the following commands:

```bash
$ sudo apt-get update
$ sudo apt-get install python3.8 python3-pip
```

Linux Mint and Ubuntu 17 and below: Python 3.8 isn’t in the Universe repository, so you need to get it from a Personal Package Archive (PPA). For example, to install from the “deadsnakes” PPA, use the following commands:

```bash
$ sudo add-apt-repository ppa:deadsnakes/ppa
$ sudo apt-get update
$ sudo apt-get install python3.8 python3-pip
```

## ตรวจสอบการติดตั้ง Python บนเครื่องโดยใช้ Terminal หรือ Command Prompt

```bash
$ python -v
```

### ติดตั้ง Libraies ที่ใช้งานสำหรับ Python

## Requirements

```
python: >3.7, <3.12
```

## Installation

```bash
pip install rembg # for library
pip install rembg[cli] # for library + cli
```

## ติดตั้ง Nodejs
ติดตั้ง NodeJS

พิมพ์คำสั่งเพื่อมติดตั้ง Package 

```bash
npm install
```

## การใช้งาน

### Dev

```bash
npm run dev
```

### Prod

```bash
npm run start
```

# การใช้งาน API

## Upload File (/upload-file)

```
const formData = new FormData();
formData.append('file', e.target.files[0]);

fetch('localhost:port/upload-file', {
    body: formData,
    method: 'POST',
})  
.then(response => response.blob())
.then(blob => {
    const fileImage = URL.createObjectURL(blob)
})
.catch(e => console.error(e))
```