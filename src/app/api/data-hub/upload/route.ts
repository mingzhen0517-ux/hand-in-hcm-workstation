import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "未选择上传文件" }, { status: 400 });
    }

    const filename = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());
    let insertedCount = 0;

    if (filename.endsWith(".xlsx") || filename.endsWith(".xls") || filename.endsWith(".csv")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      for (const row of rows) {
        const name = row["姓名"] || row["name"] || row["候选人"] || "未命名";
        const phone = String(row["电话"] || row["手机"] || row["phone"] || "");
        const email = String(row["邮箱"] || row["email"] || "");
        const position = String(row["岗位"] || row["应聘职位"] || row["position"] || "通用储备");
        const exp = parseInt(row["工作年限"] || row["经验"] || row["yearsExp"] || "0", 10) || 0;
        const skills = String(row["技能"] || row["专业能力"] || row["skills"] || "");
        const resumeText = String(row["简历内容"] || row["简介"] || row["resume"] || skills);

        await prisma.candidate.create({
          data: {
            name,
            phone,
            email,
            positionApplied: position,
            yearsExp: exp,
            skills: JSON.stringify(skills.split(/[,，、 ]+/).filter(Boolean)),
            source: `EXCEL_IMPORT:${filename}`,
            status: "NEW",
            resumeText: resumeText || `${name}，具备${exp}年工作经验，应聘${position}。`,
          },
        });
        insertedCount++;
      }
    } else {
      // 文本或单简历文件直接入库
      const text = buffer.toString("utf-8");
      const name = filename.replace(/\.[^/.]+$/, "");
      await prisma.candidate.create({
        data: {
          name,
          positionApplied: "待评估",
          source: `FILE_UPLOAD:${filename}`,
          status: "NEW",
          resumeText: text,
        },
      });
      insertedCount = 1;
    }

    return NextResponse.json({
      success: true,
      message: `成功解析并导入 ${insertedCount} 条数据至本地数据库`,
      count: insertedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        evaluations: true,
      },
    });
    return NextResponse.json({ success: true, data: candidates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
