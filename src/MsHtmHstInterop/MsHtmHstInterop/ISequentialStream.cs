﻿namespace MsHtmHstInterop
{
    using System;
    using System.Runtime.CompilerServices;
    using System.Runtime.InteropServices;

    [ComImport, InterfaceType((short) 1), Guid("0C733A30-2A1C-11CE-ADE5-00AA0044773D")]
    public interface ISequentialStream
    {
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType=MethodCodeType.Runtime)]
        void RemoteRead(out byte pv, [In] uint cb, out uint pcbRead);
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType=MethodCodeType.Runtime)]
        void RemoteWrite([In] ref byte pv, [In] uint cb, out uint pcbWritten);
    }
}

