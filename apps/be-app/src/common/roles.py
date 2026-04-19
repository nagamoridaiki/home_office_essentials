"""ロール定義"""

from enum import Enum


class Role(Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    HR = "hr"
