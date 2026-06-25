from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.dependencies import verify_firebase_token
from app.features.courses.schema import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseListResponse,
    CourseListItem,
    LessonCreate,
    LessonUpdate,
    LessonResponse,
)
from app.features.courses import service as course_service
from app.features.tutors import service as tutor_service

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/list", response_model=CourseListResponse)
async def list_courses(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    subject: str = Query(""),
    level: str = Query(""),
):
    courses, total = await course_service.list_courses(
        page=page,
        page_size=pageSize,
        search=search,
        subject=subject,
        level=level,
        published_only=True,
    )
    return CourseListResponse(
        courses=[CourseListItem(**c) for c in courses],
        total=total,
        page=page,
        pageSize=pageSize,
    )


@router.get("/my-courses", response_model=CourseListResponse)
async def get_my_courses(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor:
        raise HTTPException(status_code=403, detail="Chỉ gia sư mới có khóa học")

    courses, total = await course_service.list_courses(
        page=page,
        page_size=pageSize,
        tutor_id=tutor["uid"],
        published_only=False,
    )
    return CourseListResponse(
        courses=[CourseListItem(**c) for c in courses],
        total=total,
        page=page,
        pageSize=pageSize,
    )


@router.get("/{courseId}", response_model=CourseResponse)
async def get_course(courseId: str):
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

    lessons = await course_service.get_lessons(courseId)
    course["lessons"] = [LessonResponse(**l).model_dump() for l in lessons]
    return CourseResponse(**course)


@router.post("/create")
async def create_course(
    body: CourseCreate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor:
        raise HTTPException(status_code=403, detail="Bạn cần đăng ký làm gia sư trước")

    course = await course_service.create_course(
        tutor_uid=tutor["uid"],
        tutor_name=tutor.get("name", ""),
        tutor_avt=tutor.get("avt", ""),
        data=body.model_dump(),
    )
    return {"message": "Tạo khóa học thành công", "uid": course.get("uid")}


@router.put("/{courseId}")
async def update_course(
    courseId: str,
    body: CourseUpdate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor or course.get("tutorId") != tutor["uid"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa khóa học này")

    updates = body.model_dump(exclude_none=True)
    success = await course_service.update_course(courseId, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Cập nhật thất bại")
    return {"message": "Cập nhật thành công"}


@router.delete("/{courseId}")
async def delete_course(
    courseId: str,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor or course.get("tutorId") != tutor["uid"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa khóa học này")

    success = await course_service.delete_course(courseId)
    if not success:
        raise HTTPException(status_code=500, detail="Xóa thất bại")
    return {"message": "Đã xóa khóa học"}


@router.get("/{courseId}/lessons", response_model=list[LessonResponse])
async def get_course_lessons(courseId: str):
    lessons = await course_service.get_lessons(courseId)
    return [LessonResponse(**l) for l in lessons]


@router.post("/{courseId}/lessons")
async def add_lesson(
    courseId: str,
    body: LessonCreate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor or course.get("tutorId") != tutor["uid"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền thêm bài học")

    lesson = await course_service.add_lesson(courseId, body.model_dump())
    return {"message": "Thêm bài học thành công", "uid": lesson.get("uid")}


@router.put("/{courseId}/lessons/{lessonId}")
async def update_lesson(
    courseId: str,
    lessonId: str,
    body: LessonUpdate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor or course.get("tutorId") != tutor["uid"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa")

    updates = body.model_dump(exclude_none=True)
    success = await course_service.update_lesson(lessonId, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học")
    return {"message": "Cập nhật thành công"}


@router.delete("/{courseId}/lessons/{lessonId}")
async def delete_lesson(
    courseId: str,
    lessonId: str,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    course = await course_service.get_course(courseId)
    if not course:
        raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor or course.get("tutorId") != tutor["uid"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa bài học")
    success = await course_service.delete_lesson(lessonId)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học")
    return {"message": "Đã xóa bài học"}
