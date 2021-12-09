﻿using EVTrend.Areas.Member.Models;
using EVTrend.Controllers;
using EVTrend.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;

namespace EVTrend.Areas.Member.Controllers
{
    [Area(areaName: "Member")]

    public class MgtMemberController : _BaseController
    {
        /// <summary>
        /// 使用者管理View
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            if (getUserStatusNo() == "0") //管理員
            {
                ViewData["Member"] = GetMemberModel();
                ViewData["Status"] = GetStatusModel();
                return View("MgtMember");
            }
            else
            {
                return Redirect("~/Home/Error");
            }
        }

        private List<MemberModels> GetMemberModel()
        {
            var data = GetMember();
            List<MemberModels> list = new List<MemberModels>();

            foreach (DataRow row in data.Rows)
            {
                MemberModels model = new MemberModels();

                model.MemberNo = row.ItemArray.GetValue(0).ToString();
                model.Account = row.ItemArray.GetValue(1).ToString();
                model.Username = row.ItemArray.GetValue(2).ToString();
                model.Gender = row.ItemArray.GetValue(3).ToString();
                model.Birthday = DateTime.Parse(row.ItemArray.GetValue(4).ToString());
                model.StatusNo = row.ItemArray.GetValue(5).ToString();
                model.StatusName = row.ItemArray.GetValue(6).ToString();

                list.Add(model);
            }

            return list;
        }

        /// <summary>
        /// 撈DB會員資料
        /// </summary>
        /// <returns></returns>
        private DataTable GetMember()
        {
            var sqlStr = string.Format("SELECT m.MemberNo, m.Account, m.Username, m.Gender, m.Birthday, m.StatusNo, s.StatusName FROM member m " +
                "LEFT JOIN status s on m.StatusNo = s.StatusNo " +
                "ORDER BY StatusNo, Account ASC");

            var data = _DB_GetData(sqlStr);
            return data;
        }

        private List<StatusModels> GetStatusModel()
        {
            var data = GetStatus();
            List<StatusModels> list = new List<StatusModels>();

            foreach (DataRow row in data.Rows)
            {
                StatusModels model = new StatusModels();

                model.StatusNo = row.ItemArray.GetValue(0).ToString();
                model.StatusName = row.ItemArray.GetValue(1).ToString();

                list.Add(model);
            }

            return list;
        }

        /// <summary>
        /// 撈DB使用者身分類型
        /// </summary>
        /// <returns></returns>
        private DataTable GetStatus()
        {
            var sqlStr = string.Format("SELECT StatusNo, StatusName FROM status");

            var data = _DB_GetData(sqlStr);
            return data;
        }

        /// <summary>
        /// 修改使用者資料
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        public bool UpdateMember(MemberModels Model)
        {
            //admin check
            if (getUserStatusNo() != "0")
            {
                return false;
            }

            var sqlStr = "";
            if (Model.StatusNo == "2") //停權
            {
                sqlStr = string.Format("UPDATE member " +
                "SET Username = {0}, " +
                "Gender  = {1}," +
                "Birthday = {2}, " +
                "StatusNo = {3}, " +
                "ModifyTime = {4}, " +
                "AccountEnd = {5} " +
                "WHERE MemberNo = {6}",
                SqlVal2(Model.Username),
                SqlVal2(Model.Gender),
                SqlVal2(Model.Birthday),
                SqlVal2(Model.StatusNo),
                DBC.ChangeTimeZone(),
                DBC.ChangeTimeZone(),
                SqlVal2(Model.MemberNo));
            }
            else
            {
                sqlStr = string.Format("UPDATE member " +
                "SET Username = {0}, " +
                "Gender  = {1}," +
                "Birthday = {2}, " +
                "StatusNo = {3}, " +
                "ModifyTime = {4} " +
                "WHERE MemberNo = {5}",
                SqlVal2(Model.Username),
                SqlVal2(Model.Gender),
                SqlVal2(Model.Birthday),
                SqlVal2(Model.StatusNo),
                DBC.ChangeTimeZone(),
                SqlVal2(Model.MemberNo));
            }

            var check = _DB_Execute(sqlStr);

            //修改是否成功
            if (check == 1)
            {
                //成功
                return true;
            }
            else
            {
                //失敗
                return false;
            }
        }

        /// <summary>
        /// 刪除使用者資料
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        public bool DeleteMember(MemberModels Model)
        {
            // admin check
            if (getUserStatusNo() != "0")
            {
                return false;
            }

            var sqlStr = string.Format("DELETE FROM member WHERE MemberNo = {0}", SqlVal2(Model.MemberNo));

            var check = _DB_Execute(sqlStr);

            //是否成功
            if (check == 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}